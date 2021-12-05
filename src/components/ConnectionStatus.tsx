import { FC, useEffect, useState } from 'react';
import { Power } from 'react-feather';

import { setBadge } from 'utils/badge';
import { deleteJson, getJsonKey } from 'utils/files';
import { Button } from './Button';
import { Connected } from './Connected';
import { ConnectButton } from './ConnectButton';
import { useService } from 'hooks';

export const ConnectionStatus: FC = () => {
  const service = useService();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    setConnected(service.isConnected());
  }, [service]);

  const onClick = async () => {
    service.disconnect();
    await deleteJson(getJsonKey(service.getQueryKey));
    setBadge(service.name, 0);
    setConnected(service.isConnected());
  };

  return connected ? (
    <div className="flex flex-col items-center space-y-3">
      <Connected />
      <Button startIcon={Power} onClick={onClick}>Disconnect</Button>
    </div>
  ) : (
    <ConnectButton />
  );
};
