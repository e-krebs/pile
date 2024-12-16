import { NumberInput } from '@e-krebs/react-library';
import { FC, useEffect, useState } from 'react';
import { Trash2 } from 'react-feather';

import { cleanIcons } from 'utils/icon';
import { LoaderButton } from 'components/LoadingIcon';
import { getRefreshInterval, setRefreshInterval } from 'utils/refreshInterval';

export const SharedSettings: FC = () => {
  const [refreshIntervalValue, setRefreshIntervalValue] = useState<number>();

  useEffect(() => {
    const getInitialRefreshInterval = async () => {
      setRefreshIntervalValue(await getRefreshInterval());
    };
    getInitialRefreshInterval();
  }, []);

  return refreshIntervalValue ? (
    <div className="grid auto-rows-fr grid-cols-1 gap-2 p-3 pb-9">
      <div className="flex items-baseline space-x-2">
        <NumberInput
          border="none"
          label="background refresh interval (in minutes):"
          defaultValue={refreshIntervalValue}
          width="xs"
          flow="row"
          onChange={setRefreshInterval}
        />
      </div>
      <div className="flex">
        <LoaderButton startIcon={Trash2} onClick={cleanIcons}>
          Clear icons data
        </LoaderButton>
      </div>
    </div>
  ) : null;
};
