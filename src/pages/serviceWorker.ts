import { vars, defaultVars } from 'helpers/vars';
import { getServices } from 'utils/services';
import { setBadge } from 'utils/badge';

const { refreshInterval } = vars;
const { refreshInterval: defaultRefreshInterval } = defaultVars;

const refreshBadge = async () => {
  await Promise.all(
    getServices().map(async (service) => {
      const isConnected = await service.isConnected();
      if (!isConnected) return;
      const list = await service.get({ type: 'force' });
      setBadge(service.name, list.length);
    })
  );
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

(async () => {
  const value = await chrome.storage.local.get(refreshInterval);
  let periodInMinutes: number = parseInt(value[refreshInterval]);
  if (isNaN(periodInMinutes)) periodInMinutes = defaultRefreshInterval;
  chrome.alarms.create(refreshInterval, { periodInMinutes });

  chrome.alarms.onAlarm.addListener(alarmListener);

  await refreshBadge();
})();
