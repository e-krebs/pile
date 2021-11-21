import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import { ChangeEventHandler, FC } from 'react';

import { vars, defaultVars } from 'helpers/vars';

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
    <div className="flex flex-col">
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
    </div>
  );
};
