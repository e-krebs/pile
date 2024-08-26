import cx from 'classnames';
import { FC, useMemo } from 'react';
import { Tag, X } from 'react-feather';
import { useHotkeys } from 'react-hotkeys-hook';

import { Icon } from 'components/Icon';
import { Autocomplete } from 'components/Autocomplete';

import { useListContext } from './ListContext';

interface TagFilterProps {
  hasUntaggedItem: boolean;
  tagOpen: boolean;
  openTag: (value: boolean) => void;
}

export const TagFilter: FC<TagFilterProps> = ({ hasUntaggedItem, tagOpen, openTag }) => {
  const { allTags, tag, setTag, isLoading, setIsLoading } = useListContext();

  const hasTag: boolean = useMemo(() => !tagOpen && tag !== undefined, [tag, tagOpen]);

  const onTag = async (value?: string | null) => {
    switch (value) {
      case undefined:
      case 'undefined':
        await setTag();
        break;
      case null:
      case 'null':
        await setTag(null);
        break;
      default:
        await setTag(value);
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

  useHotkeys('t', (e: KeyboardEvent) => {
    e.preventDefault();
    toggleTagOpen();
  });

  useHotkeys(
    'Escape',
    (e: KeyboardEvent) => {
      e.preventDefault();
      onTag();
    },
    { enableOnFormTags: ['INPUT'] }
  );

  return (
    <>
      <div
        className={cx(
          'flex cursor-pointer space-x-2 py-1',
          hasTag ? 'px-2' : 'px-1',
          hasTag && 'rounded-lg border border-gray-400 text-gray-500 dark:text-gray-400',
          hasTag && 'bg-gray-100 dark:bg-gray-800'
        )}
        onClick={hasTag ? () => onTag() : toggleTagOpen}
        title={tagOpen ? 'Close tag filter (or press <esc>)' : 'Filter by tag (or press <t>)'}
      >
        <Icon icon={Tag} className="h-4 w-4 cursor-pointer pt-[1px]" />
        {hasTag && (
          <div className=" group flex items-center border-b border-transparent text-sm hover:border-dashed hover:border-inherit">
            <span>{tag ? tag : 'untagged'}</span>
            <X className="mb-[-3px] h-4 w-0 transition-width group-hover:w-4" />
          </div>
        )}
      </div>
      {tagOpen && (
        <div className="relative h-6 min-w-[25%]">
          <Autocomplete
            aria-label="tag filter"
            autoFocus
            options={[
              ...(hasUntaggedItem ? [{ value: 'null', label: 'untagged' }] : []),
              ...allTags.map((value) => ({ value })),
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
