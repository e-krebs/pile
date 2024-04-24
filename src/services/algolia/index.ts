import type { Service } from 'utils/services';
import { getQueryKey, name } from './const';
import { deleteAllKeys, isConnected } from './helpers';
import { get } from './get';
import { Icon } from './Icon';
import { Setup } from './Setup';

export type AlgoliaServiceName = 'algolia';

export const algolia: Service = {
  name,
  getQueryKey,
  get,
  disconnect: deleteAllKeys,
  isConnected,
  Icon,
  borderClassName: 'border-algolia',
  hasOAuth: false,
  Setup,
  isUpdatable: false,
  isTogglable: true,
};
