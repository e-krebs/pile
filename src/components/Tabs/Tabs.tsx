import cx from 'classnames';
import { FC, PropsWithChildren, useState } from 'react';

import { ServiceContext } from 'hooks';
import { type ServiceNames } from 'services';
import { isService, SharedTabProps, Tab } from './Tab';

export type TabProps = SharedTabProps & { content: FC };

export interface TabsProps {
  tabs: TabProps[];
  initialSelected?: number;
  onTabChange?: (service?: ServiceNames) => Promise<void>;
}

interface Selected {
  index: number;
  tab: TabProps;
}

export const Tabs: FC<PropsWithChildren<TabsProps>> = ({
  tabs,
  children,
  onTabChange,
  initialSelected: tabIndex = 0,
}) => {
  const [selected, setSelected] = useState<Selected>({ index: tabIndex, tab: tabs[tabIndex] });

  const service = isService(selected.tab) ? selected.tab.service : null;
  const Content = selected.tab.content;

  return (
    <ServiceContext.Provider value={service}>
      <div
        className={cx(
          'sticky top-0 mb-2 flex space-x-2 px-2',
          'border-b border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700'
        )}
      >
        {tabs.map(({ content, ...tab }, index) => (
          <Tab
            {...tab}
            key={index}
            active={selected.index === index}
            onClick={async () => {
              const tab = tabs[index];
              setSelected({ index, tab });
              if (onTabChange) {
                await onTabChange(isService(tab) ? tab.service.name : undefined);
              }
            }}
          />
        ))}
        <div className="grow" />
        {children}
      </div>
      <div className="grow p-2">
        <Content key={selected.index} />
      </div>
    </ServiceContext.Provider>
  );
};
