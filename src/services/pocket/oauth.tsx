import { FC, useState } from 'react';
import ReactDOM from 'react-dom';
import { useAsyncEffect } from 'use-async-effect';

import { authorize, get } from './api';
import 'content/tailwind.css';
import { Footer } from 'components/Footer';
import { Connected } from './Connected';

const root = document.getElementById('root');

type OAuthState = 'inprogress' | 'failed' | 'success';

const Component: FC = () => {
  const [state, setState] = useState<OAuthState>('inprogress');

  useAsyncEffect(async () => {
    const ok = await authorize();
    setState(ok ? 'success' : 'failed');
    if (ok) {
      await get();
    }
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
        {state === 'success' && <Connected />}
      </div>
      <Footer />
    </div>
  );
};

ReactDOM.render(<Component />, root);
