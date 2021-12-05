import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import type { ChangeEventHandler, FC } from 'react';
import { Trash2 } from 'react-feather';

import { vars, defaultVars } from 'helpers/vars';
import { cleanIcons } from 'utils/icon';
import { Button } from 'components/Button';

export const SharedSettings: FC = () => {
  const { refreshInterval } = vars;
  const { refreshInterval: defaultRefreshInterval } = defaultVars;

  const updateRefreshInterval: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = parseInt(e.currentTarget.value);
    if (typeof value === 'number' && !isNaN(value)) {
      localStorage[refreshInterval] = value;
    }
  };

  return (
    <div className="grid grid-cols-1 auto-rows-fr gap-2">
      <FormControlLabel
        control={<Checkbox defaultChecked={true} disabled={true} />}
        label="Enable Pocket."
      />
      <div className="flex items-baseline space-x-2">
        <div className="flex-shrink-0">
          background refresh interval (in minutes):
        </div>
        <TextField
          type="number"
          defaultValue={localStorage[refreshInterval] ?? defaultRefreshInterval}
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          className="w-10"
          onChange={updateRefreshInterval}
        />
      </div>
      <div className="flex">
        <Button startIcon={Trash2} onClick={cleanIcons}>Clear icons data</Button>
      </div>
    </div>
  );
};
