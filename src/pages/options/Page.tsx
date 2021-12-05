import type { FC } from 'react';

import { ConnectionStatus } from 'components/ConnectionStatus';
import { Tabs, TabProps } from 'components/Tabs';
import { OptionsIcon } from 'components/OptionsIcon';
import { SharedSettings } from './SharedSettings';
import { getServices, ServiceType } from 'utils/services';
import { ServiceItems } from 'services';

const services = getServices();

const serviceToTab = (
  { name, borderClassName, Icon, connect, disconnect, isConnected }: ServiceType<ServiceItems>
): TabProps => {
  const content = () => (
    <ConnectionStatus
      name={name}
      Icon={Icon}
      connect={connect}
      disconnect={disconnect}
      isConnected={isConnected}
    />
  );

  return { borderClassName, icon: Icon, content };
};

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
