import { getFromLocalStorage } from 'helpers/localstorage';
import { type ServiceNames } from 'services';
import { serviceVars } from 'helpers/vars';

export const getShowCountOnBadge = async (): Promise<Record<ServiceNames, boolean>> => {
  const values =
    (await getFromLocalStorage<Partial<Record<ServiceNames, boolean>>>(serviceVars.showCountOnBadge)) ??
    {};

  const result: Record<ServiceNames, boolean> = { algolia: true, pocket: true };

  for (const [serviceName, value] of Object.entries(values)) {
    result[serviceName as ServiceNames] = value;
  }

  return result;
};
