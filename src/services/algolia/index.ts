import type { Service } from 'utils/services';

import { getQueryKey, name } from './const';
import { deleteAllKeys, isConnected } from './helpers';
import { get } from './get';

export type AlgoliaServiceName = 'algolia';

export const algolia: Service = {
  name,
  getQueryKey,
  get,
  disconnect: deleteAllKeys,
  isConnected,
  borderClassName: 'border-algolia',
  hasOAuth: false,
  isUpdatable: false,
  isTogglable: true,
};
