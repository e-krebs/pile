import cx from 'classnames';
import type { FC } from 'react';

import { getRgba } from 'utils/palette';
import { beautifyUrl } from 'utils/url';
import { Link } from 'components/Link';
import { MainIcon } from './MainIcon';
import { Chevron } from './Chevron';
import { useItemContext } from './ItemContext';
import { DeleteAction } from './DeleteAction';
import { ArchiveAction } from './ArchiveAction';
import { Tags } from './Tags';
import { useService } from 'hooks';

export const ItemComponent: FC = () => {
  const { isUpdatable } = useService();
  const { url, title, rgb, isOpen } = useItemContext();

  return (
    <div className="rounded-md" style={{ backgroundColor: getRgba(rgb, 0.1) }}>
      <div
        className={cx(
          'rounded-md py-2 hover:bg-inherit',
          isOpen ? 'bg-inherit' : 'bg-white dark:bg-gray-900'
        )}
      >
        <div className="flex items-start space-x-4 pl-2">
          <MainIcon />
          <div className={cx('flex grow items-baseline space-x-2 overflow-auto')}>
            <Link
              className={cx('grow pt-0.5 hover:text-inherit', !isOpen && 'truncate')}
              url={url}
              title={`${beautifyUrl(url)} – ${title}`}
            >
              {title}
            </Link>
            <Tags />
          </div>
          <Chevron />
        </div>
        {isUpdatable && (
          <div className={cx('flex px-2 transition-height', isOpen ? 'visible h-10' : 'invisible h-0')}>
            <div className="grow" />
            <DeleteAction />
            <ArchiveAction />
            <div className="h-8 w-8 shrink-0" />
          </div>
        )}
      </div>
    </div>
  );
};
