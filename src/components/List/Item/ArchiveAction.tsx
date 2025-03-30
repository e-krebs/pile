import { FC, useState } from 'react';
import { Archive } from 'react-feather';
import { useQueryClient } from 'react-query';

import { Action } from 'components/Action';
import { useService } from 'hooks';
import { clearCache } from 'utils/dataCache';
import { archiveItem } from 'utils/updatable';

import { useItemContext } from './ItemContext';

export const ArchiveAction: FC = () => {
  const queryClient = useQueryClient();
  const service = useService();
  const { rgb, id } = useItemContext();
  const [archiveLoading, setArchiveLoading] = useState(false);

  const onArchive = async () => {
    if (!service.isUpdatable) return;
    setArchiveLoading(true);
    await archiveItem({ service, id });
    await clearCache(service.getQueryKey, queryClient);
    setArchiveLoading(false);
  };

  if (!service.isUpdatable) return null;

  return (
    <Action icon={Archive} rgb={rgb} title="archive" onClick={onArchive} loading={archiveLoading} />
  );
};
