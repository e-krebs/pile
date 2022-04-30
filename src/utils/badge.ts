import { color, colorSelected } from 'helpers/vars';
import { ServiceNames } from 'services';
import { currentUrlIsMatching } from './currentUrlIsMatching';
import { getServices, Service } from './services';

const badgePath = 'badge';
type BadgeValues = Record<ServiceNames, number>;

const getBadgeValues = async (services: Service[]): Promise<BadgeValues> => {
  const badgeValues = (await chrome.storage.local.get(badgePath)) as BadgeValues;

  const result: Record<string, number> = {};
  const serviceList = Object.keys(services) as ServiceNames[];

  for (const service of serviceList) {
    let value = 0;
    if (badgeValues != null && badgeValues[service]) value = badgeValues[service];
    result[service] = value;
  }

  return result as Record<ServiceNames, number>;
};

export const setBadge = async (service: ServiceNames, value: number) => {
  const services = getServices();
  const badgeValues = await getBadgeValues(services);
  badgeValues[service] = value;

  await chrome.storage.local.set({ [badgePath]: badgeValues });

  const total: number = Object.values(badgeValues).reduce((a, b) => a + b);

  const tabs = await chrome.tabs.query({ active: true });
  const url = tabs.length > 0 ? tabs[0].url : undefined;
  const isMatching = url ? await currentUrlIsMatching(new URL(url), services) : false;

  if (total > 0) {
    setBadgeColor(isMatching);
    chrome.action.setBadgeText({ text: total.toString() });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
};

export const setBadgeColor = (currentUrlIsMatching: boolean) => {
  chrome.action.setIcon({
    path: `/content/icons/icon-96${currentUrlIsMatching ? '-selected' : ''}.png`,
  });
  chrome.action.setBadgeBackgroundColor({ color: currentUrlIsMatching ? colorSelected : color });
};
