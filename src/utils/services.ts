import type { FC } from 'react';

import { ServiceNames, services } from 'services';

import { GetParams } from './get';
import { ListItem } from './typings';

interface BaseService {
  name: ServiceNames;
  getQueryKey: string;
  get: (param: GetParams) => Promise<ListItem[]>;
  disconnect: () => Promise<void | void[]>;
  isConnected: () => Promise<boolean>;
  Icon: FC<{ className?: string }>;
  borderClassName: string;
  isTogglable: boolean;
}

export interface UpdatableService {
  add: (url: string, tags?: string[]) => Promise<void>;
  archiveItem: (id: string) => Promise<boolean>;
  deleteItem: (id: string) => Promise<boolean>;
  addTag: (id: string, tag: string) => Promise<boolean>;
  removeTag: (id: string, tag: string) => Promise<boolean>;
}

export interface ServiceWithOAuth {
  authorize: () => Promise<boolean>;
  connect: () => Promise<boolean>;
}

export type ComponentContext = 'popup' | 'options';
export interface ServiceWithoutOAuth {
  Setup: FC<{ context: ComponentContext }>;
}

export type Service = BaseService &
  (({ hasOAuth: true } & ServiceWithOAuth) | ({ hasOAuth: false } & ServiceWithoutOAuth)) &
  (({ isUpdatable: true } & UpdatableService) | { isUpdatable: false });

export const getServices = () => {
  return Object.values(services) as Service[];
};

export const getService = (name: string): Service | undefined => services[name as ServiceNames];

export const getServiceOauthUrl = (name: string) => chrome.runtime.getURL(`pages/oauth/${name}.html`);
