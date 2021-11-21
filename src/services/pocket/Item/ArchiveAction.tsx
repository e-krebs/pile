import { FC, useState } from 'react';
import { Archive } from 'react-feather';
import { useQueryClient } from 'react-query';

import { Action } from 'components/Action';
import { archiveItem, queryKeys } from 'services/pocket/api';
import { clearCache } from 'utils/dataCache';
import { useItemContext } from './ItemContext';

export const ArchiveAction: FC = () => {
  const queryClient = useQueryClient();
  const { rgb, itemId } = useItemContext();
  const [archiveLoading, setArchiveLoading] = useState(false);

  const onArchive = async () => {
    setArchiveLoading(true);
    const ok = await archiveItem(itemId);
    if (ok) {
      await clearCache(queryKeys.get, queryClient);
    }
    setArchiveLoading(false);
  };

  return (
    <Action icon={Archive} rgb={rgb} title="archive" onClick={onArchive} loading={archiveLoading} />
  );
};
