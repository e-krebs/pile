import { FC } from 'react';
import cx from 'classnames';

import Algolia from 'content/img/algolia.svg';

interface Props {
  className?: string;
}

export const Icon: FC<Props> = ({ className }) => <Algolia className={cx('h-6 w-6', className)} />;
