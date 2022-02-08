import type { FC } from 'react';
import cx from 'classnames';
import { Settings } from 'react-feather';

interface Props {
  className?: string;
}

export const OptionsIcon: FC<Props> = ({ className }) => (
  <Settings className={cx('h-6 w-6', className)} />
);
