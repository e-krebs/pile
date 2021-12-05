import { FC } from 'react';

import { List as RawList, ListProps } from 'components/List';
import { PocketItem, itemToListItem } from './item';
import { getQueryKeys } from './const';
import { archiveItem, deleteItem } from './apiActions';
import { get, search } from './apiGet';

const PocketList = RawList as FC<ListProps<PocketItem>>;

export const List: FC = () => (
  <PocketList
    getQueryKey={getQueryKeys}
    get={get}
    search={search}
    archiveItem={archiveItem}
    deleteItem={deleteItem}
    itemToListItem={itemToListItem}
  />
);
