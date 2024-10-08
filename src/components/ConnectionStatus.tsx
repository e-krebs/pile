import { FC, useEffect, useState } from 'react';
import { Power } from 'react-feather';

import { setBadge } from 'utils/badge';
import { useService } from 'hooks';
import { deleteFromLocalStorage } from 'helpers/localstorage';

import { LoaderButton } from './LoadingIcon';
import { Connected } from './Connected';
import { ConnectButton } from './ConnectButton';

export const ConnectionStatus: FC = () => {
  const service = useService();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const getStatus = async () => {
      setConnected(await service.isConnected());
    };
    getStatus();
  }, [service]);

  const onClick = async () => {
    await service.disconnect();
    await deleteFromLocalStorage(service.getQueryKey);
    setBadge(service.name, 0);
    const isConnected = await service.isConnected();
    setConnected(isConnected);
  };

  return connected ? (
    <div className="flex flex-col items-center space-y-3">
      <Connected />
      <LoaderButton startIcon={Power} onClick={onClick}>
        Disconnect
      </LoaderButton>
    </div>
  ) : (
    <ConnectButton />
  );
};
