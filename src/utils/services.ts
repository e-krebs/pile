import type { FC } from 'react';

import { services } from 'services';
import type { JsonArrayCache } from './dataCache';
import { ListItem } from './typings';

export interface Service {
  name: string;
  getQueryKey: string;
  forceGet: () => Promise<JsonArrayCache<ListItem>>;
  get: () => Promise<JsonArrayCache<ListItem>>;
  search: (search: string) => Promise<JsonArrayCache<ListItem>>;
  authorize: () => Promise<boolean>;
  connect: () => Promise<boolean>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
  archiveItem: (id: string) => Promise<boolean>;
  deleteItem: (id: string) => Promise<boolean>;
  Icon: FC;
  borderClassName: string;
}

export const getServices = () => {
  return Object.values(services) as Service[];
};

export const getServiceOauthUrl = (name: string) =>
  chrome.extension.getURL(`pages/oauth/${name}.html`);
