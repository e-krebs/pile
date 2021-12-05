import { FC, useEffect, useState } from 'react';
import { Power } from 'react-feather';

import { ServiceNames } from 'services';
import { setBadge } from 'utils/badge';
import { Button } from './Button';
import { Connected } from './Connected';
import { ConnectButton } from './ConnectButton';

interface ConnectionStatusProps {
  name: ServiceNames;
  Icon: FC<{ className?: string }>;
  connect: () => Promise<boolean>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
}

export const ConnectionStatus: FC<ConnectionStatusProps> = ({
  name,
  Icon,
  connect,
  disconnect,
  isConnected,
}) => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    setConnected(isConnected());
  }, [isConnected]);

  const onClick = async () => {
    await disconnect();
    setBadge(name, 0);
    setConnected(isConnected());
  };

  return connected ? (
    <div className="flex flex-col items-center space-y-3">
      <Connected name={name} />
      <Button startIcon={Power} onClick={onClick}>Disconnect</Button>
    </div>
  ) : (
    <ConnectButton Icon={Icon} connect={connect} />
  );
};
