import { FC } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import 'content/tailwind.css';
import { Footer } from 'components/Footer';
import { Tabs, Tab, TabProps } from 'components/Tabs';
import { OptionsIcon } from 'components/OptionsIcon';
import { getServices, ServiceType } from 'utils/services';
import { cacheDurationMs } from 'utils/dataCache';

const services = getServices();

const serviceToTab = (
  { borderClassName, isConnected, Icon, List, ConnectionStatus }: ServiceType<unknown>
): TabProps => ({
  borderClassName,
  icon: Icon,
  content: isConnected() ? List : ConnectionStatus,
});

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
