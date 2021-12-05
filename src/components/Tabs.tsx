import { FC, useMemo, useState } from 'react';
import cx from 'classnames';

interface SharedTabProps {
  borderClassName?: string;
  Icon: FC;
  rounded?: 'full' | 't-md';
}

export type TabProps = SharedTabProps & { content: FC };

export interface TabsProps {
  tabs: TabProps[]
  tabIndex?: number;
}

export const Tabs: FC<TabsProps> = ({ tabs, children, tabIndex = 0 }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(tabIndex);
  const Content = useMemo(
    () => tabs[selectedIndex].content,
    [selectedIndex, tabs]
  );

  return (
    <>
      <div className="flex px-2 mb-2 space-x-2 border-b border-gray-200 bg-gray-50">
        {tabs.map(
          ({ content, ...tab }, index) =>
            <Tab
              {...tab}
              key={index}
              active={selectedIndex === index}
              onClick={() => setSelectedIndex(index)}
            />
        )}
        <div className="flex-grow" />
        {children}
      </div>
      <div className="px-2 py-2">
        <Content />
      </div>
    </>
  );
};

type IProps = SharedTabProps & {
  active?: boolean;
  onClick: () => void;
}

export const Tab: FC<IProps> = ({
  active = false,
  borderClassName: color,
  Icon,
  onClick,
  rounded = 't-md'
}) => (
  <div
    className={cx(
      'p-3 hover:bg-gray-200 cursor-pointer',
      color,
      rounded === 't-md' && 'rounded-t-md',
      rounded === 'full' && 'rounded-full',
      active && 'border-b-2'
    )}
    onClick={onClick}
  >
    <Icon />
  </div>
);
