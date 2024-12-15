import { FC, PropsWithChildren } from 'react';
import { Search } from 'react-feather';
import { useHotkeys } from 'react-hotkeys-hook';

import { Icon } from 'components/Icon';
import { SearchInput } from 'components/SearchInput';

import { useListContext } from './ListContext';

interface SearchFilterProps {
  searchOpen: boolean;
  openSearch: (value: boolean) => void;
}
export const SearchFilter: FC<PropsWithChildren<SearchFilterProps>> = ({
  searchOpen,
  openSearch,
  children,
}) => {
  const { setSearchTerm } = useListContext();

  const onSearch = (value?: string) => {
    if (!value) {
      setSearchTerm(null);
    } else {
      setSearchTerm(value);
    }
  };

  useHotkeys('s', (e: KeyboardEvent) => {
    e.preventDefault();
    openSearch(true);
  });
  useHotkeys(
    'Escape',
    (e: KeyboardEvent) => {
      e.preventDefault();
      openSearch(false);
      onSearch();
    },
    { enableOnFormTags: ['INPUT'] },
  );

  return (
    <>
      <Icon
        icon={Search}
        title={searchOpen ? 'Close search (or press <esc>)' : 'Open search (or press <s>)'}
        className="ml-2 h-8 w-8 cursor-pointer p-1"
        onClick={() => openSearch(!searchOpen)}
      />
      {searchOpen && <SearchInput onSearch={onSearch} className="grow" />}
      {!searchOpen && <>{children}</>}
    </>
  );
};
