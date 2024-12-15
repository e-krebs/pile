import { FC, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import 'tailwind.css';
import { List } from 'components/List';
import { ConnectionStatus } from 'components/ConnectionStatus';
import { Footer } from 'components/Footer';
import { Tabs, Tab, TabProps } from 'components/Tabs';
import { OptionsIcon } from 'components/OptionsIcon';
import { FullService } from 'utils/services';
import { cacheDurationMs } from 'utils/dataCache';
import { getLastTab, setLastTab } from 'utils/lastTab';
import { getFromLocalStorage } from 'helpers/localstorage';
import { ServiceNames } from 'services';
import { serviceVars } from 'helpers/vars';
import { getFullServices } from 'utils/getFullService';

const services = getFullServices();

const serviceToTab = async (service: FullService): Promise<TabProps> => {
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
  const [initialSelected, setInitialSelected] = useState<number>(-1);
  const [tabs, setTabs] = useState<TabProps[]>([]);

  useEffect(() => {
    const getTabs = async () => {
      const selectedService = await getLastTab();
      const activeService =
        (await getFromLocalStorage<Partial<Record<ServiceNames, boolean>>>(serviceVars.active)) ?? {};
      const currentServices = services.filter(
        (service) => !service.isTogglable || activeService[service.name] !== false,
      );

      const tabs = await Promise.all(currentServices.map(await serviceToTab));
      const selectedIndex = currentServices.findIndex(({ name }) => name === selectedService);

      setInitialSelected(Math.max(0, selectedIndex));
      setTabs(tabs);
    };
    getTabs();
  }, []);

  return tabs.length > 0 && initialSelected >= 0 ? (
    <QueryClientProvider client={queryClient}>
      <Tabs tabs={tabs} onTabChange={setLastTab} initialSelected={initialSelected}>
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
