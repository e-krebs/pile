import cx from 'classnames';
import type { FC } from 'react';

import { getRgba } from 'utils/palette';
import { Link } from 'components/Link';
import { MainIcon } from './MainIcon';
import { Chevron } from './Chevron';
import { useItemContext } from './ItemContext';
import { DeleteAction } from './DeleteAction';
import { ArchiveAction } from './ArchiveAction';

export const ItemComponent: FC = () => {
  const { url, title, rgb, isOpen } = useItemContext();

  return (
    <div
      className="rounded-md"
      style={{ backgroundColor: getRgba(rgb, 0.1) }}
    >
      <div
        className={cx(
          'py-2 rounded-md hover:bg-inherit',
          isOpen ? 'bg-inherit' : 'bg-white'
        )}
      >
        <div className="flex px-2 space-x-6 items-start">
          <MainIcon />
          <Link
            className={cx('flex-grow pt-0.5 hover:text-inherit', !isOpen && 'truncate')}
            url={url}
            title={`${url} – ${title}`}
          >
            {title}
          </Link>
          <Chevron />
        </div>
        <div
          className={cx(
            'flex px-2 transition-height',
            isOpen ? 'h-10 visible' : 'h-0 invisible'
          )}
        >
          <div className="flex-grow" />
          <DeleteAction />
          <ArchiveAction />
          <div className="w-8 h-8 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
};
