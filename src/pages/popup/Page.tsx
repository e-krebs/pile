import { FC } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import 'content/tailwind.css';
import { List as RawList, ListProps } from 'components/List';
import { ConnectionStatus } from 'components/ConnectionStatus';
import { Footer } from 'components/Footer';
import { Tabs, Tab, TabProps } from 'components/Tabs';
import { OptionsIcon } from 'components/OptionsIcon';
import { getServices, ServiceType } from 'utils/services';
import { cacheDurationMs } from 'utils/dataCache';
import { ServiceItems } from 'services';

const services = getServices();

const serviceToTab = (
  {
    name,
    getQueryKey,
    borderClassName,
    get,
    search,
    connect,
    disconnect,
    isConnected,
    archiveItem,
    deleteItem,
    Icon,
    itemToListItem,
  }: ServiceType<ServiceItems>
): TabProps => {
  const List = RawList as FC<ListProps<ServiceItems>>;
  const content: FC = () => isConnected()
    ? <List
        getQueryKey={getQueryKey}
        get={get}
        search={search}
        archiveItem={archiveItem}
        deleteItem={deleteItem}
        itemToListItem={itemToListItem}
      />
    : (
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
