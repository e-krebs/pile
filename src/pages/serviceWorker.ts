import { vars, defaultVars } from 'helpers/vars';
import { getService, getServices } from 'utils/services';
import { setBadge, setBadgeColor } from 'utils/badge';
import { forceGet } from 'utils/get';
import { currentUrlIsMatching } from 'utils/currentUrlIsMatching';
import { createContextMenus } from 'utils/createContextMenus';
import { Message } from 'utils/messages';

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

const onMessageListener = async (message: Message, _: unknown, sendMessage: () => void) => {
  switch (message.action) {
    case 'addToService': {
      sendMessage();
      const service = getService(message.service);
      if (!service) {
        throw Error(`couldn't find service "${message.service}"`);
      }
      await service.add(message.url);
      await refreshBadge();
      return;
    }
    case 'archiveFromService': {
      sendMessage();
      const service = getService(message.service);
      if (!service) {
        throw Error(`couldn't find service "${message.service}"`);
      }
      await service.archiveItem(message.id);
      await refreshBadge();
      return;
    }
    case 'deleteFromService': {
      sendMessage();
      const service = getService(message.service);
      if (!service) {
        throw Error(`couldn't find service "${message.service}"`);
      }
      await service.deleteItem(message.id);
      await refreshBadge();
      return;
    }
  }
};

const onContextMenuClickedListener = (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
  if (!tab?.url) {
    throw Error('no tab.url on contextMenu clicked');
  }
  if (!tab?.id) {
    throw Error('no tab.id on contextMenu clicked');
  }
  const service = getService(info.menuItemId.toString());
  if (!service) {
    throw Error(`couldn't find service "${info.menuItemId}"`);
  }
  const message: Message = {
    action: 'service',
    service: service.name,
    url: tab.url,
  };
  chrome.tabs.sendMessage(tab.id, message);
};

chrome.tabs.onUpdated.addListener(tabsUpdatedListener);
chrome.tabs.onActivated.addListener(tabsActivatedListener);
chrome.runtime.onInstalled.addListener(onInstalledListener);
chrome.runtime.onMessage.addListener(onMessageListener);
chrome.contextMenus.onClicked.addListener(onContextMenuClickedListener);

(async () => {
  const value = await chrome.storage.local.get(refreshInterval);
  let periodInMinutes: number = parseInt(value[refreshInterval]);
  if (isNaN(periodInMinutes)) periodInMinutes = defaultRefreshInterval;
  chrome.alarms.create(refreshInterval, { periodInMinutes });

  chrome.alarms.onAlarm.addListener(alarmListener);

  await refreshBadge();
})();
