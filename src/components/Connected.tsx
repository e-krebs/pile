import type { FC } from 'react';

import Smiley from 'content/img/smiley.svg';

interface Props {
  name: string;
}

export const Connected: FC<Props> = ({ name }) => (
  <div className="flex flex-col items-center">
    <Smiley />
    <span>"Pile" has now access to {name} !</span><br />
    <span>You can close this window and start using it</span>
  </div>
);
