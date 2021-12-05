import type { ServiceType } from 'utils/services';
import { name } from './const';
import { forceGet, get, search } from './apiGet';
import { authorize } from './apiAuthorize';
import { connect } from './apiConnect';
import { disconnect } from './apiDisconnect';
import { isConnected } from './helpers';
import { Icon } from './Icon';
import { List } from './List';
import type { PocketItem } from './item';

export type PocketServiceName = 'pocket';

export const pocket: ServiceType<PocketItem> = {
  name,
  forceGet,
  get,
  search,
  authorize,
  connect,
  disconnect,
  isConnected,
  Icon,
  List,
  borderClassName: 'border-pocket',
};

export type { PocketItem } from './item';
