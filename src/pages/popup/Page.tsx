import { FC } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import 'content/tailwind.css';
import { ConnectionStatus } from 'components/ConnectionStatus';
import { Footer } from 'components/Footer';
import { Tabs, Tab, TabProps } from 'components/Tabs';
import { OptionsIcon } from 'components/OptionsIcon';
import { getServices, ServiceType } from 'utils/services';
import { cacheDurationMs } from 'utils/dataCache';

const services = getServices();

const serviceToTab = (
  { name, borderClassName, connect, disconnect, isConnected, Icon, List }: ServiceType<unknown>
): TabProps => {
  const content = isConnected() ? List: () => (
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

const queryClient = new QueryClient({
  defaultOptions: { queries: { cacheTime: cacheDurationMs } }
});

export const Page: FC = () => (
  <QueryClientProvider client={queryClient}>
    <Tabs tabs={services.map(serviceToTab)}>
      <Tab
        onClick={() => chrome.runtime.openOptionsPage()}
        active={false}
        icon={OptionsIcon}
        rounded="full"
      />
    </Tabs>
    <Footer />
    <ReactQueryDevtools />
  </QueryClientProvider>
);
