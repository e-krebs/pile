import { FC, useState } from 'react';
import { Trash2 } from 'react-feather';
import { useQueryClient } from 'react-query';

import { Action } from 'components/Action';
import { useService } from 'hooks';
import { clearCache } from 'utils/dataCache';
import { useItemContext } from './ItemContext';

export const DeleteAction: FC = () => {
  const queryClient = useQueryClient();
  const { getQueryKey, ...service } = useService();
  const { rgb, id } = useItemContext();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const onDelete = async () => {
    if (!service.isUpdatable) return;
    setDeleteLoading(true);
    const ok = await service.deleteItem(id);
    if (ok) {
      await clearCache(getQueryKey, queryClient);
    }
    setDeleteLoading(false);
  };

  if (!service.isUpdatable) return null;

  return <Action icon={Trash2} rgb={rgb} title="delete" onClick={onDelete} loading={deleteLoading} />;
};
