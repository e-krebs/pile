import { FC, useState } from 'react';
import { Trash2 } from 'react-feather';
import { useQueryClient } from 'react-query';

import { Action } from 'components/Action';
import { deleteItem, queryKeys } from 'services/pocket/api';
import { clearCache } from 'utils/dataCache';
import { useItemContext } from './ItemContext';

export const DeleteAction: FC = () => {
  const queryClient = useQueryClient();
  const { rgb, itemId } = useItemContext();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const onDelete = async () => {
    setDeleteLoading(true);
    const ok = await deleteItem(itemId);
    if (ok) {
      await clearCache(queryKeys.get, queryClient);
    }
    setDeleteLoading(false);
  };

  return (
    <Action icon={Trash2} rgb={rgb} title="delete" onClick={onDelete} loading={deleteLoading} />
  );
};
