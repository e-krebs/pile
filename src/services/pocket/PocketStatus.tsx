import { FC } from 'react';

import Smiley from 'content/img/smiley.svg';
import { isConnected } from './helpers';
import { ConnectButton } from './ConnectButton';

export const PocketStatus: FC = () => {
  const connected = isConnected();
  return connected ? (
    <div className="flex flex-col items-center">
      <Smiley />
      <span>"Pile" has now access to pocket !</span><br />
      <span>You can close this window and start using it</span>
    </div>
  ) : (
    <ConnectButton />
  );
};
