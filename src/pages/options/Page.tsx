import type { FC } from 'react';

import { Tabs } from 'components/Tabs';
import { Icon as PocketIcon } from 'services/pocket/Icon';
import { PocketStatus } from 'services/pocket/PocketStatus';
import { OptionsIcon } from 'components/OptionsIcon';
import { SharedSettings } from './SharedSettings';

export const Page: FC = () => {
  return (
    <Tabs tabs={[
      {
        borderClassName: 'border-gray-500',
        icon: OptionsIcon,
        content: SharedSettings
      },
      {
        borderClassName: 'border-pocket',
        icon: PocketIcon,
        content: PocketStatus
      }
    ]} />
  );
};
