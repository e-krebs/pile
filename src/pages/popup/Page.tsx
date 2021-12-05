import { FC } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import 'content/tailwind.css';
import { List } from 'components/List';
import { ConnectionStatus } from 'components/ConnectionStatus';
import { Footer } from 'components/Footer';
import { Tabs, Tab, TabProps } from 'components/Tabs';
import { OptionsIcon } from 'components/OptionsIcon';
import { getServices, Service } from 'utils/services';
import { cacheDurationMs } from 'utils/dataCache';

const services = getServices();

const serviceToTab = (service: Service): TabProps => {
  const content = () => service.isConnected()
    ? <List service={service} />
    : <ConnectionStatus service={service} />;
  return {
    borderClassName: service.borderClassName,
    Icon: service.Icon,
    content
  };
};

const queryClient = new QueryClient({
  defaultOptions: { queries: { cacheTime: cacheDurationMs } }
});

export const Page: FC = () => (
  <QueryClientProvider client={queryClient}>
    <Tabs tabs={services.map(serviceToTab)}>
      <Tab
        onClick={() => chrome.runtime.openOptionsPage()}
        active={false}
        Icon={OptionsIcon}
        rounded="full"
      />
    </Tabs>
    <Footer />
    <ReactQueryDevtools />
  </QueryClientProvider>
);
