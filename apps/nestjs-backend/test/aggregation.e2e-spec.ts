import type { INestApplication } from '@nestjs/common';
import type { ITableFullVo, StatisticsFunc } from '@teable/core';
import { getAggregation, getRowCount } from '@teable/openapi';
import { x_20 } from './data-helpers/20x';
import { SIMPLE_AGGREGATION_CACES } from './data-helpers/caces';
import { createTable, deleteTable, initApp } from './utils/init-app';

describe('OpenAPI AggregationController (e2e)', () => {
  let app: INestApplication;
  const baseId = globalThis.testConfig.baseId;

  beforeAll(async () => {
    const appCtx = await initApp();
    app = appCtx.app;
  });

  afterAll(async () => {
    await app.close();
  });

  async function getViewAggregations(
    tableId: string,
    viewId: string,
    funcs: StatisticsFunc,
    fieldId: string[]
  ) {
    return (
      await getAggregation(tableId, {
        viewId: viewId,
        field: { [funcs]: fieldId },
      })
    ).data;
  }

  async function getViewRowCount(tableId: string, viewId: string) {
    return (await getRowCount(tableId, { viewId })).data;
  }

  describe('simple aggregation', () => {
    let table: ITableFullVo;
    beforeAll(async () => {
      table = await createTable(baseId, {
        name: 'agg_x_20',
        fields: x_20.fields,
        records: x_20.records,
      });
    });

    afterAll(async () => {
      await deleteTable(baseId, table.id);
    });

    it('should get rowCount', async () => {
      const { rowCount } = await getViewRowCount(table.id, table.views[0].id);
      expect(rowCount).toEqual(23);
    });

    test.each(SIMPLE_AGGREGATION_CACES)(
      `should agg func [$aggFunc] value: $expectValue`,
      async ({ fieldIndex, aggFunc, expectValue }) => {
        const tableId = table.id;
        const viewId = table.views[0].id;
        const fieldId = table.fields[fieldIndex].id;

        const result = await getViewAggregations(tableId, viewId, aggFunc, [fieldId]);
        expect(result).toBeDefined();
        expect(result.aggregations?.length).toBeGreaterThan(0);

        const [{ total }] = result.aggregations!;
        expect(total?.aggFunc).toBe(aggFunc);

        if (typeof expectValue === 'string') {
          expect(total?.value).toBe(expectValue);
        } else {
          expect(total?.value).toBeCloseTo(expectValue, 4);
        }
      }
    );
  });
});
