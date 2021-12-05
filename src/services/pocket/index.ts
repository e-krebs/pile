import type { Service } from 'utils/services';
import { name, getQueryKey } from './const';
import { forceGet, get, search } from './apiGet';
import { authorize } from './apiAuthorize';
import { connect } from './apiConnect';
import { disconnect } from './apiDisconnect';
import { isConnected } from './helpers';
import { archiveItem, deleteItem } from './apiActions';
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
