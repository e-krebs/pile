import type { ServiceType } from 'utils/services';
import { forceGet, get, search } from './apiGet';
import { isConnected } from './helpers';
import { Icon } from './Icon';
import { ConnectionStatus } from './ConnectionStatus';
import { List } from './List';
import type { PocketItem } from './item';

export type PocketServiceName = 'pocket';

export const pocket: ServiceType<PocketItem> = {
  forceGet,
  get,
  search,
  isConnected,
  Icon,
  ConnectionStatus,
  List,
  borderClassName: 'border-pocket',
};

export type { PocketItem } from './item';
