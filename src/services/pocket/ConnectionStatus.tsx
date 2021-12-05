import { FC } from 'react';

import { ConnectionStatus as RawConnectionStatus } from 'components/ConnectionStatus';
import { isConnected } from './helpers';
import { ConnectButton } from './ConnectButton';
import { Connected } from './Connected';
import { disconnect } from './apiDisconnect';

export const ConnectionStatus: FC = () => (
  <RawConnectionStatus
    disconnect={disconnect}
    isConnected={isConnected}
    ConnectButton={ConnectButton}
    Connected={Connected}
  />
);
