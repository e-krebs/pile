import { FC, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import 'tailwind.css';
import { List } from 'components/List';
import { ConnectionStatus } from 'components/ConnectionStatus';
import { Footer } from 'components/Footer';
import { Tabs, Tab, TabProps } from 'components/Tabs';
import { OptionsIcon } from 'components/OptionsIcon';
import { getServices, Service } from 'utils/services';
import { cacheDurationMs } from 'utils/dataCache';

const services = getServices();

const serviceToTab = async (service: Service): Promise<TabProps> => {
  const connected = await service.isConnected();
  return {
    content: connected
      ? List
      : service.hasOAuth
      ? ConnectionStatus
      : () => {
          const Setup = service.Setup;
          return <Setup context="popup" />;
        },
    service,
  };
};

const queryClient = new QueryClient({
  defaultOptions: { queries: { cacheTime: cacheDurationMs } },
});

export const Page: FC = () => {
  const [tabs, setTabs] = useState<TabProps[]>([]);

  useEffect(() => {
    const getTabs = async () => {
      setTabs(await Promise.all(services.map(await serviceToTab)));
    };
    getTabs();
  }, []);

  return tabs.length > 0 ? (
    <QueryClientProvider client={queryClient}>
      <Tabs tabs={tabs}>
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
  ) : null;
};
