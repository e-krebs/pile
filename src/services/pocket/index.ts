import type { Service } from 'utils/services';
import { name, getQueryKey } from './const';
import { forceGet, get, search } from './get';
import { authorize } from './authorize';
import { connect } from './connect';
import { disconnect } from './disconnect';
import { isConnected } from './helpers';
import { archiveItem, deleteItem } from './actions';
import { Icon } from './Icon';

export type PocketServiceName = 'pocket';

export const pocket: Service = {
  name,
  getQueryKey,
  forceGet,
  get,
  search,
  authorize,
  connect,
  disconnect,
  isConnected,
  archiveItem,
  deleteItem,
  Icon,
  borderClassName: 'border-pocket',
};
