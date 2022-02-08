import { FC } from 'react';
import cx from 'classnames';

import Pocket from 'content/img/pocket.svg';

interface Props {
  className?: string;
}

export const Icon: FC<Props> = ({ className }) => <Pocket className={cx('h-6 w-6', className)} />;
