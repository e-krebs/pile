import type { FC } from 'react';

import { Link } from './Link';

export const Footer: FC = () => (
  <div className="py-3 text-gray-400">
    <p className="flex justify-center space-x-1 text-xs">
      <span>chrome extension by</span>
      <Link url="https://github.com/e-krebs" className="underline">
        e-krebs
      </Link>
      <span>code available on</span>
      <Link url="https://github.com/e-krebs/pile" className="underline">
        github
      </Link>
    </p>
  </div>
);
