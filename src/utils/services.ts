import type { FC } from 'react';

import { services, ServiceItems } from 'services';
import type { JsonArrayCache } from './dataCache';

export interface ServiceType<T> {
  forceGet: () => Promise<JsonArrayCache<T>>;
  get: () => Promise<JsonArrayCache<T>>;
  search: (search: string) => Promise<JsonArrayCache<T>>;
  isConnected: () => boolean;
  Icon: FC;
  ConnectionStatus: FC;
  List: FC;
  borderClassName: string;
}

export const getServices = () => {
  return Object.values(services) as ServiceType<ServiceItems>[];
};