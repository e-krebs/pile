import { FC, useEffect, useState } from 'react';
import { Power } from 'react-feather';

import { Button } from 'components/Button';

interface ConnectionStatusProps {
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
  ConnectButton: FC;
  Connected: FC;
}

export const ConnectionStatus: FC<ConnectionStatusProps> = ({
  disconnect,
  isConnected,
  ConnectButton,
  Connected,
}) => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    setConnected(isConnected());
  }, [isConnected]);

  const onClick = async () => {
    await disconnect();
    setConnected(isConnected());
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
