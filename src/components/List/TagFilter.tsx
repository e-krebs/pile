import cx from 'classnames';
import { FC, useMemo } from 'react';
import { Tag } from 'react-feather';
import { useHotkeys } from 'react-hotkeys-hook';

import { Icon } from 'components/Icon';
import { Autocomplete } from 'components/Autocomplete';
import { useListContext } from './ListContext';

interface TagFilterProps {
  tagOpen: boolean;
  openTag: (value: boolean) => void;
}

export const TagFilter: FC<TagFilterProps> = ({ tagOpen, openTag }) => {
  const { allTags, tag, setTag, isLoading, setIsLoading } = useListContext();

  const hasTag: boolean = useMemo(() => !tagOpen && tag !== undefined, [tag, tagOpen]);

  const onTag = (value?: string | null) => {
    switch (value) {
      case undefined:
      case 'undefined':
        setTag();
        break;
      case null:
      case 'null':
        setTag(null);
        break;
      default:
        setTag(value);
        break;
    }
    openTag(false);
  };

  const toggleTagOpen = () => {
    if (tagOpen) {
      onTag();
    } else {
      openTag(true);
    }
  };

  useHotkeys(
    't',
    (e) => { e.preventDefault(); toggleTagOpen(); },
  );

  useHotkeys(
    'Escape',
    (e) => { e.preventDefault(); onTag(); },
    { enableOnTags: ['INPUT'] }
  );

  return (
    <>
      <div
        className={cx(
          'flex cursor-pointer py-1 space-x-2',
          hasTag ? 'px-2' : 'px-1',
          hasTag && 'border rounded-lg bg-gray-100 border-gray-400 text-gray-500'
        )}
        onClick={hasTag ? () => onTag() : toggleTagOpen}
        title={tagOpen ? 'Close tag filter (or press <esc>)' : 'Filter by tag (or press <t>)'}
      >
        <Icon
          icon={Tag}
          className="w-4 h-4 pt-[1px] cursor-pointer"
        />
        {hasTag && (
          <div className="">
            {tag ? tag : 'untagged'}
          </div>
        )}
      </div>
      {tagOpen && (
        <div className="relative min-w-[25%] h-6">
          <Autocomplete
            aria-label="tag filter"
            autoFocus
            options={[
              // { value: 'undefined' },
              { value: 'null', label: 'untagged' },
              ...allTags.map(value => ({ value }))
            ]}
            className="absolute left-0 top-[-0.25rem] w-full shadow-xl"
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            close={onTag}
            addValueSync={onTag}
          />
        </div>
      )}
    </>
  );
};
