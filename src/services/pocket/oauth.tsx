import { FC, useState } from 'react';
import ReactDOM from 'react-dom';
import { useAsyncEffect } from 'use-async-effect';

import Smiley from 'content/img/smiley.svg';
import { authorize } from './api';
import 'content/tailwind.css';
import { Footer } from 'components/Footer';

const root = document.getElementById('root');

type OAuthState = 'inprogress' | 'failed' | 'success';

const Component: FC = () => {
  const [state, setState] = useState<OAuthState>('inprogress');

  useAsyncEffect(async () => {
    const ok = await authorize();
    setState(ok ? 'success' : 'failed');
  }, []);

  return (
    <div>
      <div className="flex justify-center p-3 my-10 text-lg">
        {state === 'inprogress' && (
          <div>
            Trying to get Pocket's authorization...
          </div>
        )}
        {state === 'failed' && (
          <div>
            Please authorize "Pile" in Pocket in order to work.
          </div>
        )}
        {state === 'success' && (
          <div className="flex flex-col items-center">
            <Smiley />
            <span>"Pile" has now access to pocket !</span><br />
            <span>You can close this window and start using it</span>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

ReactDOM.render(<Component />, root);
