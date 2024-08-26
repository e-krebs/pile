import { Service } from 'utils/services';

import { pocket, PocketServiceName } from './pocket';
import { algolia, AlgoliaServiceName } from './algolia';

export type ServiceNames = PocketServiceName | AlgoliaServiceName;

export const services: Record<ServiceNames, Service> = {
  pocket,
  algolia,
};
