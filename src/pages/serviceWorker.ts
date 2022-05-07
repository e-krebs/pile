import { vars, defaultVars } from 'helpers/vars';
import { getServices } from 'utils/services';
import { setBadge, setBadgeColor } from 'utils/badge';
import { forceGet } from 'utils/get';
import { currentUrlIsMatching } from 'utils/currentUrlIsMatching';
import { createContextMenus } from 'utils/createContextMenus';

const { refreshInterval } = vars;
const { refreshInterval: defaultRefreshInterval } = defaultVars;

const refreshBadge = async () => {
  await Promise.all(
    getServices().map(async (service) => {
      const isConnected = await service.isConnected();
      if (!isConnected) return;
      const { data } = await forceGet(service);
      setBadge(service.name, data.length);
    })
  );
};

const refreshBadgeIfMatching = async (currentUrl: URL) => {
  const services = getServices();
  const isMatching = await currentUrlIsMatching(currentUrl, services);
  setBadgeColor(isMatching);
};

const alarmListener = async (alarm: chrome.alarms.Alarm) => {
  switch (alarm.name) {
    case refreshInterval:
      await refreshBadge();
      break;
    default:
      console.warn('alarm', new Date(), alarm);
      break;
  }
};

const tabsUpdatedListener = async (
  _: number,
  __: chrome.tabs.TabChangeInfo,
  { active, url }: chrome.tabs.Tab
) => {
  if (active && url) {
    await refreshBadgeIfMatching(new URL(url));
  }
};

const tabsActivatedListener = async ({ tabId }: chrome.tabs.TabActiveInfo) => {
  const { url } = await chrome.tabs.get(tabId);
  if (url) {
    await refreshBadgeIfMatching(new URL(url));
  }
};

const onInstalledListener = async () => await createContextMenus();

chrome.tabs.onUpdated.addListener(tabsUpdatedListener);
chrome.tabs.onActivated.addListener(tabsActivatedListener);
chrome.runtime.onInstalled.addListener(onInstalledListener);

(async () => {
  const value = await chrome.storage.local.get(refreshInterval);
  let periodInMinutes: number = parseInt(value[refreshInterval]);
  if (isNaN(periodInMinutes)) periodInMinutes = defaultRefreshInterval;
  chrome.alarms.create(refreshInterval, { periodInMinutes });

  chrome.alarms.onAlarm.addListener(alarmListener);

  await refreshBadge();
})();
