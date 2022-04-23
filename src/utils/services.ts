import type { FC } from 'react';

import { ServiceNames, services } from 'services';
import { GetParams } from './get';
import { ListItem } from './typings';

export interface Service {
  name: ServiceNames;
  getQueryKey: string;
  get: (param: GetParams) => Promise<ListItem[]>;
  authorize: () => Promise<boolean>;
  connect: () => Promise<boolean>;
  disconnect: () => Promise<void | void[]>;
  isConnected: () => Promise<boolean>;
  archiveItem: (id: string) => Promise<boolean>;
  deleteItem: (id: string) => Promise<boolean>;
  addTag: (id: string, tag: string) => Promise<boolean>;
  removeTag: (id: string, tag: string) => Promise<boolean>;
  Icon: FC<{ className?: string }>;
  borderClassName: string;
}

export const getServices = () => {
  return Object.values(services) as Service[];
};

export const getServiceOauthUrl = (name: string) => chrome.runtime.getURL(`pages/oauth/${name}.html`);
