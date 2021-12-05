import { FC } from 'react';

import { ConnectionStatus as RawConnectionStatus } from 'components/ConnectionStatus';
import { name } from './const';
import { Icon } from './Icon';
import { connect } from './apiConnect';
import { disconnect } from './apiDisconnect';
import { isConnected } from './helpers';

export const ConnectionStatus: FC = () => (
  <RawConnectionStatus
    name={name}
    Icon={Icon}
    connect={connect}
    disconnect={disconnect}
    isConnected={isConnected}
  />
);
