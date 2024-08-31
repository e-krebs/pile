import { color, colorSelected } from 'helpers/vars';
import { ServiceNames } from 'services';
import { getFromLocalStorage, setToLocalStorage } from 'helpers/localstorage';

import { currentUrlIsMatching } from './currentUrlIsMatching';
import { Service } from './services';
import { getActiveTab } from './getActiveTab';
import { getShowCountOnBadge } from './getShowCountOnBadge';
import { getServices } from './getService';

const badgePath = 'badge';
type BadgeValues = Record<ServiceNames, number>;

const getBadgeValues = async (services: Service[]): Promise<BadgeValues> => {
  const badgeValues = await getFromLocalStorage<BadgeValues>(badgePath);

  const result: Record<string, number> = {};
  const serviceList: ServiceNames[] = services.map((x) => x.name);

  for (const service of serviceList) {
    let value = 0;
    if (badgeValues != null && badgeValues[service]) value = badgeValues[service];
    result[service] = value;
  }

  return result as Record<ServiceNames, number>;
};

const updateBadgeInner = async (services: Service[], badgeValues: BadgeValues) => {
  await setToLocalStorage(badgePath, badgeValues);

  const showCountOnBadgeByService = await getShowCountOnBadge();

  const total: number = services
    .map((service) => {
      const show = showCountOnBadgeByService[service.name] ?? true;
      return show ? badgeValues[service.name] : 0;
    })
    .reduce((a, b) => a + b);

  const url = await getActiveTab();
  const isMatching = url ? await currentUrlIsMatching(url, services) : false;

  if (total > 0) {
    setBadgeColor(isMatching);
    chrome.action.setBadgeText({ text: total.toString() });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
};

export const setBadge = async (service: ServiceNames, value: number) => {
  const services = getServices();
  const badgeValues = await getBadgeValues(services);
  badgeValues[service] = value;
  updateBadgeInner(services, badgeValues);
};

export const updateBadge = async () => {
  const services = getServices();
  const badgeValues = await getBadgeValues(services);
  updateBadgeInner(services, badgeValues);
};

export const setBadgeColor = (currentUrlIsMatching: boolean) => {
  chrome.action.setIcon({
    path: chrome.runtime.getURL(
      `src/content/icons/icon-96${currentUrlIsMatching ? '-selected' : ''}.png`
    ),
  });
  chrome.action.setBadgeBackgroundColor({ color: currentUrlIsMatching ? colorSelected : color });
};
