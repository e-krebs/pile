import { type Service } from 'utils/services';

import { pocket } from './pocket';
import { algolia } from './algolia';
import { type ServiceNames } from './types';

export { ServiceNames };

export const services: Record<ServiceNames, Service> = {
  pocket,
  algolia,
};
