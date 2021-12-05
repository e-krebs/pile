import { Service } from 'utils/services';
import { pocket, PocketServiceName } from './pocket';

export type ServiceNames = PocketServiceName;

export const services: Record<ServiceNames, Service> = {
  pocket,
};
