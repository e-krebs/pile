import { getFromLocalStorage } from 'helpers/localstorage';
import { services, type ServiceNames } from 'services';
import { serviceVars } from 'helpers/vars';

export const getShowCountOnBadge = async (): Promise<Record<ServiceNames, boolean>> => {
  const values =
    (await getFromLocalStorage<Partial<Record<ServiceNames, boolean>>>(serviceVars.showCountOnBadge)) ??
    {};

  const result: Record<ServiceNames, boolean> = (Object.keys(services) as ServiceNames[]).reduce(
    (acc, serviceName) => {
      acc[serviceName] = values[serviceName] ?? true;
      return acc;
    },
    {} as Record<ServiceNames, boolean>,
  );

  return result;
};
