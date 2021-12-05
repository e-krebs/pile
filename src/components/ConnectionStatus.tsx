import { FC, useEffect, useState } from 'react';
import { Power } from 'react-feather';

import { setBadge } from 'utils/badge';
import { Button } from './Button';
import { Connected } from './Connected';
import { ConnectButton } from './ConnectButton';
import { Service } from 'utils/services';

interface ConnectionStatusProps {
  service: Service;
}

export const ConnectionStatus: FC<ConnectionStatusProps> = ({ service }) => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    setConnected(service.isConnected());
  }, [service]);

  const onClick = async () => {
    await service.disconnect();
    setBadge(service.name, 0);
    setConnected(service.isConnected());
  };

  return connected ? (
    <div className="flex flex-col items-center space-y-3">
      <Connected service={service} />
      <Button startIcon={Power} onClick={onClick}>Disconnect</Button>
    </div>
  ) : (
    <ConnectButton service={service} />
  );
};
