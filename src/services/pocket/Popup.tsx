import type { FC } from 'react';

import { isConnected } from './helpers';
import { ConnectButton } from './ConnectButton';
import { List } from './List';

export const Popup: FC = () => isConnected() ? <List /> : <ConnectButton />;
