import cx from 'classnames';
import type { FC } from 'react';

interface Props {
  url: string;
  className?: string;
  title?: string;
}

export const Link: FC<Props> = ({ url, className, title, children }) => (
  <a
    className={cx('cursor-pointer hover:text-gray-900', className)}
    href={url}
    target="_blank"
    rel="noreferrer"
    title={title}
  >
    {children}
  </a>
);
