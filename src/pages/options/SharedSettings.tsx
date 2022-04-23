import { FC, useEffect, useState } from 'react';
import { Trash2 } from 'react-feather';

import { vars, defaultVars } from 'helpers/vars';
import { cleanIcons } from 'utils/icon';
import { Button } from 'components/Button';
import { TextInput } from 'library/TextInput';
import { Checkbox } from 'library/Checkbox';

const { refreshInterval } = vars;
const { refreshInterval: defaultRefreshInterval } = defaultVars;

export const SharedSettings: FC = () => {
  const [refreshIntervalValue, setRefreshIntervalValue] = useState<number>();

  const updateRefreshInterval = async (stringValue: string) => {
    const value = parseInt(stringValue);
    if (typeof value === 'number' && !isNaN(value)) {
      await chrome.storage.local.set({ [refreshInterval]: value });
    }
  };

  useEffect(() => {
    const getRefreshInterval = async () => {
      const value = await chrome.storage.local.get(refreshInterval);
      let periodInMinutes: number = parseInt(value[refreshInterval]);
      if (isNaN(periodInMinutes)) periodInMinutes = defaultRefreshInterval;
      setRefreshIntervalValue(periodInMinutes);
    };
    getRefreshInterval();
  }, []);

  return refreshIntervalValue ? (
    <div className="grid auto-rows-fr grid-cols-1 gap-2">
      <Checkbox label="Enable Pocket" defaultSelected={true} isDisabled={true} />
      <div className="flex items-baseline space-x-2">
        <TextInput
          label="background refresh interval (in minutes):"
          type="number"
          defaultValue={refreshIntervalValue.toString()}
          className="w-10 !rounded-none !border-x-0 !border-t-0 bg-inherit !text-inherit"
          labelClassName="leading-7"
          flow="row"
          onChange={updateRefreshInterval}
          pattern="[0-9]*"
        />
      </div>
      <div className="flex">
        <Button startIcon={Trash2} onClick={cleanIcons}>
          Clear icons data
        </Button>
      </div>
    </div>
  ) : null;
};
