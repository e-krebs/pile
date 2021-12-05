import type { FC } from 'react';
import cx from 'classnames';
import { Settings } from 'react-feather';

interface Props {
  className?: string;
}

export const OptionsIcon: FC<Props> = ({ className }) =>
  <Settings className={cx('w-6 h-6', className)} />;
