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
        'flex-shrink-0 cursor-pointer',
        'flex items-center justify-center w-10 h-10',
        'rounded-full hover:bg-gray-100'
      )}
      title={title}
      onClick={onClick}
    >
      <Icon
        className={cx('w-5 h-5', loading && 'animate-spin')}
        style={{ color: getRgba(rgb, 0.6) }}
      />
    </div>
  );
};
