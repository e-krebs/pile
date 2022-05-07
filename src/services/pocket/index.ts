import type { Service } from 'utils/services';
import { name, getQueryKey } from './const';
import { get } from './get';
import { add } from './add';
import { authorize } from './authorize';
import { connect } from './connect';
import { deleteAllKeys, isConnected } from './helpers';
import { archiveItem, deleteItem, addTag, removeTag } from './actions';
import { Icon } from './Icon';

export type PocketServiceName = 'pocket';

export const pocket: Service = {
  name,
  getQueryKey,
  get,
  add,
  authorize,
  connect,
  disconnect: deleteAllKeys,
  isConnected,
  archiveItem,
  deleteItem,
  addTag,
  removeTag,
  Icon,
  borderClassName: 'border-pocket',
};
