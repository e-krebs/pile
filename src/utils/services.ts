import type { FC } from 'react';

import { services, ServiceItems } from 'services';
import type { JsonArrayCache } from './dataCache';
import { ListItem } from './typings';

export interface ServiceType<T> {
  name: string;
  getQueryKey: string;
  forceGet: () => Promise<JsonArrayCache<T>>;
  get: () => Promise<JsonArrayCache<T>>;
  search: (search: string) => Promise<JsonArrayCache<T>>;
  authorize: () => Promise<boolean>;
  connect: () => Promise<boolean>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
  archiveItem: (id: string) => Promise<boolean>;
  deleteItem: (id: string) => Promise<boolean>;
  Icon: FC;
  borderClassName: string;
  itemToListItem: (item: T) => ListItem;
}

export const getServices = () => {
  return Object.values(services) as ServiceType<ServiceItems>[];
};

export const getServiceOauthUrl = (name: string) =>
  chrome.extension.getURL(`pages/oauth/${name}.html`);
