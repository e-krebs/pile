import type { Service } from 'utils/services';
import { name, getQueryKey } from './const';
import { get } from './get';
import { authorize } from './authorize';
import { connect } from './connect';
import { deleteAllKeys, isConnected } from './helpers';
import { archiveItem, deleteItem } from './actions';
import { Icon } from './Icon';

export type PocketServiceName = 'pocket';

export const pocket: Service = {
  name,
  getQueryKey,
  get,
  authorize,
  connect,
  disconnect: deleteAllKeys,
  isConnected,
  archiveItem,
  deleteItem,
  Icon,
  borderClassName: 'border-pocket',
};
