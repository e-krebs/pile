import type { FC } from 'react';

import { Tabs, TabProps } from 'components/Tabs';
import { OptionsIcon } from 'components/OptionsIcon';
import { getServices, Service } from 'utils/services';

import { SharedSettings } from './SharedSettings';
import { OptionsWrapper } from './OptionsWrapper';

const services = getServices();

const serviceToTab = (service: Service): TabProps => ({
  content: () => <OptionsWrapper service={service} />,
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
