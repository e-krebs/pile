import { vars } from 'helpers/vars';
import { getService, getServices } from 'utils/getService';
import { setBadgeColor } from 'utils/badge';
import { get } from 'utils/get';
import { currentUrlIsMatching } from 'utils/currentUrlIsMatching';
import { createContextMenus } from 'utils/createContextMenus';
import { Message } from 'utils/messages';
import { getAllTags } from 'utils/getAllTags';
import { getRefreshInterval } from 'utils/refreshInterval';
import { addItem, addTag, archiveItem, deleteItem, removeTag } from 'utils/updatable';
import { refreshBadge } from 'utils/refreshBadge';

const refreshBadgeIfMatching = async (currentUrl: string) => {
  const services = getServices();
  const isMatching = await currentUrlIsMatching(currentUrl, services);
  setBadgeColor(isMatching);
};

const alarmListener = async (alarm: chrome.alarms.Alarm) => {
  switch (alarm.name) {
    case vars.refreshInterval:
      await refreshBadge(true);
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
      const { url, tags } = message;
      await addItem({ service, url, tags });
      return;
    }
    case 'archiveFromService': {
      sendMessage();
      const service = getService(message.service);
      if (!service) {
        throw Error(`couldn't find service "${message.service}"`);
      }
      const { id } = message;
      await archiveItem({ service, id });
      return;
    }
    case 'deleteFromService': {
      sendMessage();
      const service = getService(message.service);
      if (!service) {
        throw Error(`couldn't find service "${message.service}"`);
      }
      const { id } = message;
      await deleteItem({ service, id });
      return;
    }
    case 'addTag': {
      sendMessage();
      const service = getService(message.service);
      if (!service) {
        throw Error(`couldn't find service "${message.service}"`);
      }
      const { id, tag } = message;
      const tags = await addTag({ service, id, tag });

      if (sender.tab?.id) {
        const newMessage: Message = {
          action: 'service',
          service: service.name,
          url: message.url,
          tags,
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
      const { id, tag } = message;
      const tags = await removeTag({ service, id, tag });

      if (sender.tab?.id) {
        const newMessage: Message = {
          action: 'service',
          service: service.name,
          url: message.url,
          tags,
        };
        chrome.tabs.sendMessage(sender.tab.id, newMessage);
      }
      return;
    }
    case 'refresh': {
      sendMessage();
      await refreshBadge(true);
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
