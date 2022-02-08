import cx from 'classnames';
import type { FC } from 'react';
import { Icon as FeatherIcon, Loader } from 'react-feather';

import { getRgba, RGB } from 'utils/palette';

export interface ActionProps {
  icon: FeatherIcon;
  loading: boolean;
  rgb: RGB;
  title?: string;
  onClick?: () => void;
}

export const Action: FC<ActionProps> = ({ icon, rgb, title, onClick, loading }) => {
  const Icon = loading ? Loader : icon;

  return (
    <div
      className={cx(
        'shrink-0 cursor-pointer',
        'flex h-10 w-10 items-center justify-center',
        'rounded-full hover:bg-gray-100 hover:dark:bg-gray-800'
      )}
      title={title}
      onClick={onClick}
    >
      <Icon className={cx('h-5 w-5', loading && 'animate-spin')} style={{ color: getRgba(rgb, 0.6) }} />
    </div>
  );
};
