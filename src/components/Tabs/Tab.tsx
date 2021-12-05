import cx from 'classnames';
import { FC } from 'react';

export interface SharedTabProps {
  borderClassName?: string;
  Icon: FC;
  rounded?: 'full' | 't-md';
}

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
