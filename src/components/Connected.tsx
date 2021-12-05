import type { FC } from 'react';

import Smiley from 'content/img/smiley.svg';
import { Service } from 'utils/services';

interface Props {
  service: Service;
}

export const Connected: FC<Props> = ({ service: { name } }) => (
  <div className="flex flex-col items-center">
    <Smiley />
    <span>"Pile" has now access to {name} !</span><br />
    <span>You can close this window and start using it</span>
  </div>
);
