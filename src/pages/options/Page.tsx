import type { FC } from 'react';

import { Tabs, TabProps } from 'components/Tabs';
import { OptionsIcon } from 'components/OptionsIcon';
import { FullService } from 'utils/services';
import { getFullServices } from 'utils/getFullService';

import { SharedSettings } from './SharedSettings';
import { OptionsWrapper } from './OptionsWrapper';

const services = getFullServices();

const serviceToTab = (service: FullService): TabProps => ({
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
