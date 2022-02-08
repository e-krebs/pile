import type { FC } from 'react';

import { ConnectionStatus } from 'components/ConnectionStatus';
import { Tabs, TabProps } from 'components/Tabs';
import { OptionsIcon } from 'components/OptionsIcon';
import { SharedSettings } from './SharedSettings';
import { getServices, Service } from 'utils/services';

const services = getServices();

const serviceToTab = (service: Service): TabProps => ({
  content: ConnectionStatus,
  service,
});

export const Page: FC = () => (
  <Tabs
    tabs={[
      {
        borderClassName: 'border-gray-500',
        Icon: OptionsIcon,
        content: SharedSettings,
      },
      ...services.map(serviceToTab),
    ]}
  />
);
