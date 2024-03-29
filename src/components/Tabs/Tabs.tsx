import cx from 'classnames';
import { FC, PropsWithChildren, useMemo, useState } from 'react';

import { Service } from 'utils/services';
import { ServiceContext } from 'hooks';
import { isService, SharedTabProps, Tab } from './Tab';

export type TabProps = SharedTabProps & { content: FC };

export interface TabsProps {
  tabs: TabProps[];
  tabIndex?: number;
}

export const Tabs: FC<PropsWithChildren<TabsProps>> = ({ tabs, children, tabIndex = 0 }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(tabIndex);
  const service: Service | null = useMemo(() => {
    const selectedTab = tabs[selectedIndex];
    return isService(selectedTab) ? selectedTab.service : null;
  }, [selectedIndex, tabs]);
  const Content = useMemo(() => tabs[selectedIndex].content, [selectedIndex, tabs]);

  return (
    <ServiceContext.Provider value={service}>
      <div
        className={cx(
          'mb-2 flex space-x-2 px-2',
          'border-b border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700'
        )}
      >
        {tabs.map(({ content, ...tab }, index) => (
          <Tab
            {...tab}
            key={index}
            active={selectedIndex === index}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
        <div className="grow" />
        {children}
      </div>
      <div className="px-2 py-2">
        <Content />
      </div>
    </ServiceContext.Provider>
  );
};
