import { FC, useEffect, useState } from 'react';
import { Power } from 'react-feather';

import { Button } from 'components/Button';
import { isConnected } from './helpers';
import { ConnectButton } from './ConnectButton';
import { Connected } from './Connected';
import { disconnect } from './api';

export const PocketStatus: FC = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    setConnected(isConnected());
  }, []);

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
