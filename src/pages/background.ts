import { vars, defaultVars } from 'helpers/vars';
import { setBadge } from 'utils/badge';
import { getServices } from 'utils/services';

const { refreshInterval } = vars;
const { refreshInterval: defaultRefreshInterval } = defaultVars;

const services = getServices();

const alarmListener = async (alarm: chrome.alarms.Alarm) => {
  switch (alarm.name) {
    case refreshInterval:
      for (const service of services) {
        const list = await service.forceGet();
        setBadge(service.name, list.data.length);
      }
      break;
    default:
      console.warn('alarm', new Date(), alarm);
      break;
  }
};

chrome.alarms.create(refreshInterval, {
  periodInMinutes: localStorage[refreshInterval] ?? defaultRefreshInterval
});
chrome.alarms.onAlarm.addListener(alarmListener);

(async () => {
  await Promise.all([
    services.map(async (service) => {
      const list = await service.forceGet();
      setBadge(service.name, list.data.length);
    })
  ]);
})();
