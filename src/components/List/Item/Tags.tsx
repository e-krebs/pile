import cx from 'classnames';
import { FC, useMemo } from 'react';
import { Tag } from 'react-feather';

import { getRgba } from 'utils/palette';
import { useItemContext } from './ItemContext';

export const Tags: FC = () => {
  const { rgb, tags, isOpen } = useItemContext();
  const color = useMemo(() => getRgba(rgb, 0.8), [rgb]);
  const borderColor = useMemo(() => getRgba(rgb, 0.6), [rgb]);

  return (
    <div
      className="text-xs leading-3 rounded-full cursor-default"
      style={{ color, borderColor }}
    >
      <div
        className={cx(
          'flex items-center px-2 py-1 h-fit border rounded-full bg-gray-100',
          isOpen ? 'border-inherit text-inherit' : 'border-gray-400 text-gray-500'
        )}
      >
        <Tag className="w-3 h-3 mb-[-1px] shrink-0" />
        {tags.length > 0 && (
          <div className="truncate mb-px mt-[-1px]">
            {tags.map(tag => <span key={tag} className="ml-1" title={tag}>{tag}</span>)}
          </div>
        )}
      </div>
    </div >
  );
};
