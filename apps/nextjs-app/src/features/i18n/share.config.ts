import type { I18nActiveNamespaces } from '@/lib/i18n';

export interface IShareConfig {
  // Define namespaces in use in both the type and the config.
  i18nNamespaces: I18nActiveNamespaces<'share' | 'sdk'>;
}

export const shareConfig: IShareConfig = {
  i18nNamespaces: ['share', 'sdk'],
};
