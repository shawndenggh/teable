import { ViewType } from '@teable/core';
import { ArrowUpRight, Code2, Component, Database, MoreHorizontal, Share2 } from '@teable/icons';
import { useDriver, useTablePermission, useView } from '@teable/sdk/hooks';
import { Button, cn, Popover, PopoverContent, PopoverTrigger } from '@teable/ui-lib/shadcn';
import Link from 'next/link';
import { GUIDE_API_BUTTON } from '@/components/Guide';
import { DbConnectionPanelTrigger } from '../../db-connection/PanelTrigger';
import { useCellGraphStore } from '../../graph/useCellGraphStore';
import { SearchButton } from '../search/SearchButton';
import { SharePopover } from './SharePopover';
import { ToolBarButton } from './ToolBarButton';

const OthersList = ({
  classNames,
  className,
}: {
  classNames?: { textClassName?: string; buttonClassName?: string };
  className?: string;
}) => {
  const { toggleGraph } = useCellGraphStore();
  const view = useView();
  const driver = useDriver();
  const permission = useTablePermission();

  return (
    <div className={className}>
      <SharePopover>
        {(text, isActive) => (
          <ToolBarButton
            isActive={isActive}
            text={text}
            textClassName={classNames?.textClassName}
            className={classNames?.buttonClassName}
            disabled={!permission['view|update']}
          >
            <ArrowUpRight className="size-4" />
          </ToolBarButton>
        )}
      </SharePopover>

      {view?.type === ViewType.Grid && (
        <Popover>
          <PopoverTrigger asChild>
            <ToolBarButton
              text="Extensions"
              textClassName={classNames?.textClassName}
              className={classNames?.buttonClassName}
            >
              <Component className="size-4" />
            </ToolBarButton>
          </PopoverTrigger>
          <PopoverContent side="bottom" align="start" className="w-40 p-0">
            <Button
              variant={'ghost'}
              size={'xs'}
              className="w-full justify-start font-normal"
              onClick={() => toggleGraph()}
            >
              <Share2 className="pr-1 text-lg" />
              Graph
            </Button>
          </PopoverContent>
        </Popover>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <ToolBarButton
            text="API"
            className={cn(GUIDE_API_BUTTON, classNames?.buttonClassName)}
            textClassName={classNames?.textClassName}
          >
            <Code2 className="size-4" />
          </ToolBarButton>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="start" className="w-48 p-0">
          <Button
            variant={'ghost'}
            size={'xs'}
            className="w-full justify-start font-normal"
            asChild
          >
            <Link href="/docs" target="_blank">
              <Code2 className="size-4" />
              Restful API
            </Link>
          </Button>
          <DbConnectionPanelTrigger>
            <Button variant={'ghost'} size={'xs'} className="w-full justify-start font-normal">
              <Database className="pr-1 text-lg" />
              <span className="capitalize">{driver}</span>Connection
            </Button>
          </DbConnectionPanelTrigger>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const OthersMenu = ({ className }: { className?: string }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'ghost'}
          size={'xs'}
          className={cn('font-normal shrink-0 truncate', className)}
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" className="w-40 p-0">
        <OthersList
          className="flex flex-col"
          classNames={{ textClassName: 'inline', buttonClassName: 'justify-start rounded-none' }}
        />
      </PopoverContent>
    </Popover>
  );
};

export const Others: React.FC = () => {
  return (
    <div className="flex flex-1 justify-end gap-1 @container/toolbar-others">
      <SearchButton />
      <OthersList
        className="hidden @sm/toolbar:flex"
        classNames={{ textClassName: '@[300px]/toolbar-others:inline' }}
      />
      <OthersMenu className="@sm/toolbar:hidden" />
    </div>
  );
};
