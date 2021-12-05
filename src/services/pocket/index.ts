import type { ServiceType } from 'utils/services';
import { name } from './const';
import { forceGet, get, search } from './apiGet';
import { authorize } from './apiAuthorize';
import { isConnected } from './helpers';
import { Icon } from './Icon';
import { ConnectionStatus } from './ConnectionStatus';
import { List } from './List';
import type { PocketItem } from './item';

export type PocketServiceName = 'pocket';

export const pocket: ServiceType<PocketItem> = {
  name,
  forceGet,
  get,
  search,
  authorize,
  isConnected,
  Icon,
  ConnectionStatus,
  List,
  borderClassName: 'border-pocket',
};

export type { PocketItem } from './item';
