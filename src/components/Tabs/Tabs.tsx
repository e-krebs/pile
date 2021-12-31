import cx from 'classnames';
import { FC, useMemo, useState } from 'react';

import { Service } from 'utils/services';
import { ServiceContext } from 'hooks';
import { isService, SharedTabProps, Tab } from './Tab';

export type TabProps = SharedTabProps & { content: FC };

export interface TabsProps {
  tabs: TabProps[]
  tabIndex?: number;
}

export const Tabs: FC<TabsProps> = ({ tabs, children, tabIndex = 0 }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(tabIndex);
  const service: Service | null = useMemo(
    () => {
      const props = tabs[selectedIndex];
      return isService(props) ? props.service : null;
    },
    [selectedIndex, tabs]
  );
  const Content = useMemo(
    () => tabs[selectedIndex].content,
    [selectedIndex, tabs]
  );

  return (
    <ServiceContext.Provider value={service}>
      <div
        className={cx(
          'flex px-2 mb-2 space-x-2',
          ' border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
        )}
      >
        {tabs.map(
          ({ content, ...tab }, index) =>
            <Tab
              {...tab}
              key={index}
              active={selectedIndex === index}
              onClick={() => setSelectedIndex(index)}
            />
        )}
        <div className="grow" />
        {children}
      </div>
      <div className="px-2 py-2">
        <Content />
      </div>
    </ServiceContext.Provider>
  );
};
