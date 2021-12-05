import { FC, useState } from 'react';
import { Archive } from 'react-feather';
import { useQueryClient } from 'react-query';

import { Action } from 'components/Action';
import { useListContext } from 'components/List';
import { clearCache } from 'utils/dataCache';
import { useItemContext } from './ItemContext';

export const ArchiveAction: FC = () => {
  const queryClient = useQueryClient();
  const { getQueryKey, archiveItem } = useListContext();
  const { rgb, id } = useItemContext();
  const [archiveLoading, setArchiveLoading] = useState(false);

  const onArchive = async () => {
    setArchiveLoading(true);
    const ok = await archiveItem(id);
    if (ok) {
      await clearCache(getQueryKey, queryClient);
    }
    setArchiveLoading(false);
  };

  return (
    <Action icon={Archive} rgb={rgb} title="archive" onClick={onArchive} loading={archiveLoading} />
  );
};
