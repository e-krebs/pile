import { FC } from 'react';

import { isConnected } from './helpers';
import { ConnectButton } from './ConnectButton';
import { Connected } from './Connected';

export const PocketStatus: FC = () => {
  const connected = isConnected();

  return connected ? (
    <Connected />
  ) : (
    <ConnectButton />
  );
};
