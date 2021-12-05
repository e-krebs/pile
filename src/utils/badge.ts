import { color } from 'helpers/vars';
import { ServiceNames } from 'services';
import { readJson, writeJson } from './files';
import { getServices } from './services';
import { Path } from './typings';

const badgePath: Path = ['badge.json'];
type BadgeValues = Record<ServiceNames, number>;

const getBadgeValues = async (): Promise<BadgeValues> => {
  const badgeValues = await readJson<BadgeValues>(badgePath);

  const result: Record<string, number> = {};
  const services = getServices();
  const serviceList = Object.keys(services) as ServiceNames[];

  for (const service of serviceList) {
    let value = 0;
    if (badgeValues != null && badgeValues[service]) value = badgeValues[service];
    result[service] = value;
  }

  return result as Record<ServiceNames, number>;
};

export const setBadge = async (service: ServiceNames, value: number) => {
  const badgeValues = await getBadgeValues();
  badgeValues[service] = value;

  await writeJson(badgePath, badgeValues);

  const total: number = Object.values(badgeValues).reduce((a, b) => a + b);

  if (total > 0) {
    chrome.browserAction.setBadgeBackgroundColor({ color });
    chrome.browserAction.setBadgeText({ text: total.toString() });
  } else {
    chrome.browserAction.setBadgeText({});
  }
};
