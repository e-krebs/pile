import type { Service, ServiceWithOAuth, UpdatableService } from 'utils/services';

import { name, getQueryKey } from './const';
import { get } from './get';
import { add } from './add';
import { authorize } from './authorize';
import { connect } from './connect';
import { deleteAllKeys, isConnected } from './helpers';
import { archiveItem, deleteItem, addTag, removeTag } from './actions';

export type PocketServiceName = 'pocket';

export const pocket: Service & UpdatableService & ServiceWithOAuth = {
  name,
  getQueryKey,
  get,
  internal_add: add,
  authorize,
  connect,
  disconnect: deleteAllKeys,
  isConnected,
  internal_archiveItem: archiveItem,
  internal_deleteItem: deleteItem,
  internal_addTag: addTag,
  internal_removeTag: removeTag,
  borderClassName: 'border-pocket',
  hasOAuth: true,
  isUpdatable: true,
  isTogglable: true,
};
