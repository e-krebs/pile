import type { FC } from 'react';

import { type ServiceNames } from 'services';

import { type GetParams } from './get';
import { type ListItem } from './typings';

interface BaseService {
  name: ServiceNames;
  getQueryKey: string;
  get: (param: GetParams) => Promise<ListItem[]>;
  disconnect: () => Promise<void | void[]>;
  isConnected: () => Promise<boolean>;
  borderClassName: string;
  isTogglable: boolean;
}

export interface UpdatableService {
  internal_add: (url: string, tags?: string[]) => Promise<ListItem>;
  internal_archiveItem: (id: string) => Promise<boolean>;
  internal_deleteItem: (id: string) => Promise<boolean>;
  internal_addTag: (id: string, tag: string) => Promise<boolean>;
  internal_removeTag: (id: string, tag: string) => Promise<boolean>;
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
  (({ hasOAuth: true } & ServiceWithOAuth) | { hasOAuth: false }) &
  (({ isUpdatable: true } & UpdatableService) | { isUpdatable: false });

type ExtendedService = {
  Icon: FC<{ className?: string }>;
} & ({ hasOAuth: true } | ({ hasOAuth: false } & ServiceWithoutOAuth));

export type FullService = Service & ExtendedService;
