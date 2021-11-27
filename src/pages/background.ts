import { vars, defaultVars } from 'helpers/vars';
import { forceGet as forceGetPocket } from 'services/pocket/api';

const { refreshInterval } = vars;
const { refreshInterval: defaultRefreshInterval } = defaultVars;

const alarmListener = async (alarm: chrome.alarms.Alarm) => {
  switch (alarm.name) {
    case refreshInterval:
      await forceGetPocket();
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

forceGetPocket();
