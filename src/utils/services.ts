import type { FC } from 'react';

import { services, ServiceItems } from 'services';
import type { JsonArrayCache } from './dataCache';

export interface ServiceType<T> {
  name: string;
  forceGet: () => Promise<JsonArrayCache<T>>;
  get: () => Promise<JsonArrayCache<T>>;
  search: (search: string) => Promise<JsonArrayCache<T>>;
  authorize: () => Promise<boolean>;
  isConnected: () => boolean;
  Icon: FC;
  ConnectionStatus: FC;
  List: FC;
  borderClassName: string;
}

export const getServices = () => {
  return Object.values(services) as ServiceType<ServiceItems>[];
};

export const getServiceOauthUrl = (name: string) =>
  chrome.extension.getURL(`pages/oauth/${name}.html`);
