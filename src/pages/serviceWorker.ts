import { vars } from 'helpers/vars';
import { getService, getServices } from 'utils/getService';
import { setBadge, setBadgeColor } from 'utils/badge';
import { forceGet, get } from 'utils/get';
import { currentUrlIsMatching } from 'utils/currentUrlIsMatching';
import { createContextMenus } from 'utils/createContextMenus';
import { Message } from 'utils/messages';
import { getAllTags } from 'utils/getAllTags';
import { getShowCountOnBadge } from 'utils/getShowCountOnBadge';
import { getRefreshInterval } from 'utils/refreshInterval';

const refreshBadge = async (force = true) => {
  await Promise.all(
    getServices().map(async (service) => {
      const isConnected = await service.isConnected();
      if (!isConnected) return;
      const showCountOnBadge = await getShowCountOnBadge();
      if (showCountOnBadge[service.name] === false) return;
      const { data } = force ? await forceGet(service) : await get(service);
      setBadge(service.name, data.length);
    }),
  );
};

const refreshBadgeIfMatching = async (currentUrl: string) => {
  const services = getServices();
  const isMatching = await currentUrlIsMatching(currentUrl, services);
  setBadgeColor(isMatching);
};

const alarmListener = async (alarm: chrome.alarms.Alarm) => {
  switch (alarm.name) {
    case vars.refreshInterval:
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
  { active, url }: chrome.tabs.Tab,
) => {
  if (active && url) {
    await refreshBadgeIfMatching(url);
  }
};

const tabsActivatedListener = async ({ tabId }: chrome.tabs.TabActiveInfo) => {
  const { url } = await chrome.tabs.get(tabId);
  if (url) {
    await refreshBadgeIfMatching(url);
  }
};

const onInstalledListener = async () => await createContextMenus();

const onMessageListener = async (
  message: Message,
  sender: chrome.runtime.MessageSender,
  sendMessage: () => void,
) => {
  switch (message.action) {
    case 'addToService': {
      sendMessage();
      const service = getService(message.service);
      if (!service) {
        throw Error(`couldn't find service "${message.service}"`);
      }
      if (!service.isUpdatable) {
        throw Error(`cannot add: service "${message.service}" is not updatable`);
      }
      await service.add(message.url, message.tags);
      await refreshBadge();
      return;
    }
    case 'archiveFromService': {
      sendMessage();
      const service = getService(message.service);
      if (!service) {
        throw Error(`couldn't find service "${message.service}"`);
      }
      if (!service.isUpdatable) {
        throw Error(`cannot archive: service "${message.service}" is not updatable`);
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
      if (!service.isUpdatable) {
        throw Error(`cannot delete: service "${message.service}" is not updatable`);
      }
      await service.deleteItem(message.id);
      await refreshBadge();
      return;
    }
    case 'addTag': {
      sendMessage();
      const service = getService(message.service);
      if (!service) {
        throw Error(`couldn't find service "${message.service}"`);
      }
      if (!service.isUpdatable) {
        throw Error(`cannot add tag: service "${message.service}" is not updatable`);
      }
      await service.addTag(message.id, message.tag);
      if (sender.tab?.id) {
        const cachedData = await forceGet(service);
        const newMessage: Message = {
          action: 'service',
          service: service.name,
          url: message.url,
          tags: getAllTags(cachedData),
        };
        chrome.tabs.sendMessage(sender.tab.id, newMessage);
      }
      return;
    }
    case 'removeTag': {
      sendMessage();
      const service = getService(message.service);
      if (!service) {
        throw Error(`couldn't find service "${message.service}"`);
      }
      if (!service.isUpdatable) {
        throw Error(`cannot remove tag: service "${message.service}" is not updatable`);
      }
      await service.removeTag(message.id, message.tag);
      if (sender.tab?.id) {
        const cachedData = await forceGet(service);
        const newMessage: Message = {
          action: 'service',
          service: service.name,
          url: message.url,
          tags: getAllTags(cachedData),
        };
        chrome.tabs.sendMessage(sender.tab.id, newMessage);
      }
      return;
    }
    case 'refresh': {
      sendMessage();
      await refreshBadge();
    }
  }
};

const onContextMenuClickedListener = async (
  info: chrome.contextMenus.OnClickData,
  tab?: chrome.tabs.Tab,
) => {
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
  const cachedData = await get(service);
  const message: Message = {
    action: 'service',
    service: service.name,
    url: tab.url,
    tags: getAllTags(cachedData),
  };
  chrome.tabs.sendMessage(tab.id, message);
};

chrome.tabs.onUpdated.addListener(tabsUpdatedListener);
chrome.tabs.onActivated.addListener(tabsActivatedListener);
chrome.runtime.onInstalled.addListener(onInstalledListener);
chrome.runtime.onMessage.addListener(onMessageListener);
chrome.contextMenus.onClicked.addListener(onContextMenuClickedListener);

(async () => {
  chrome.alarms.create(vars.refreshInterval, { periodInMinutes: await getRefreshInterval() });
  chrome.alarms.onAlarm.addListener(alarmListener);

  await refreshBadge(false);
})();
