import type { FC } from 'react';

import { Tabs, TabProps } from 'components/Tabs';
import { OptionsIcon } from 'components/OptionsIcon';
import { SharedSettings } from './SharedSettings';
import { getServices, ServiceType } from 'utils/services';

const services = getServices();

const serviceToTab = (
  { borderClassName, Icon, ConnectionStatus }: ServiceType<unknown>
): TabProps => ({
  borderClassName,
  icon: Icon,
  content: ConnectionStatus,
});

export const Page: FC = () => (
  <Tabs tabs={[
    {
      borderClassName: 'border-gray-500',
      icon: OptionsIcon,
      content: SharedSettings
    },
    ...services.map(serviceToTab),
  ]} />
);
