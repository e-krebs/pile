import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import 'content/tailwind.css';
import { Footer } from 'components/Footer';
import { Tabs, Tab } from 'components/Tabs';
import { Icon as PocketIcon } from 'services/pocket/Icon';
import { Popup as PocketPopup } from 'services/pocket/Popup';
import { OptionsIcon } from 'components/OptionsIcon';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 5 * 60 * 1000 // 5 minutes
    }
  }
});

ReactDOM.render(
  (
    <QueryClientProvider client={queryClient}>
      <Tabs
        tabs={[
          { borderClassName: 'border-pocket', icon: PocketIcon, content: PocketPopup }
        ]}
      >
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
  ),
  document.getElementById('root')
);
