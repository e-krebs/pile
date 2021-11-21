import { FC, useMemo, useState } from 'react';
import cx from 'classnames';

interface TabsProps {
  tabs: (Omit<TabProps, 'active' | 'onClick'> & { content: FC })[]
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

interface TabProps {
  active?: boolean;
  borderClassName?: string;
  icon: FC;
  onClick: () => void;
  rounded?: 'full' | 't-md';
}

export const Tab: FC<TabProps> = ({
  active = false,
  borderClassName: color,
  icon: Icon,
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
