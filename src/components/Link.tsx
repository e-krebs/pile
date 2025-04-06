import cx from 'classnames';
import type { FC, PropsWithChildren } from 'react';

interface Props {
  url: string;
  className?: string;
  title?: string;
}

export const Link: FC<PropsWithChildren<Props>> = ({ url, className, title, children }) => (
  <a
    className={cx('cursor-pointer hover:text-gray-900 dark:hover:text-gray-100', className)}
    href={url}
    target="_blank"
    rel="noreferrer"
    title={title}
  >
    {children}
  </a>
);
