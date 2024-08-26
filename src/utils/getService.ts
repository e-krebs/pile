import { services } from 'services';
import { type ServiceNames } from 'services';

import { type Service } from './services';

export const getServices = () => {
  return Object.values(services) as Service[];
};
export const getService = (name: string): Service | undefined => services[name as ServiceNames];
