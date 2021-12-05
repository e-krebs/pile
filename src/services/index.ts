import { ServiceType } from 'utils/services';
import { pocket, PocketItem, PocketServiceName } from './pocket';

export type ServiceNames = PocketServiceName;
export type ServiceItems = PocketItem;

export const services: Record<ServiceNames, ServiceType<ServiceItems>> = {
  pocket,
};
