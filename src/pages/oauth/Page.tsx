import { FC, useEffect, useMemo, useState } from 'react';

import { Footer } from 'components/Footer';
import { services, ServiceNames } from 'services';
import type { Service } from 'utils/services';
import { Connected } from 'components/Connected';
import { setBadge } from 'utils/badge';
import { get } from 'utils/get';
import { ServiceContext } from 'hooks';
import { createContextMenus } from 'utils/createContextMenus';

type OAuthState = 'inprogress' | 'failed' | 'success';

interface PageProps {
  serviceName?: string | null;
}

export const Page: FC<PageProps> = ({ serviceName }) => {
  const service: Service | null = useMemo(() => {
    if (!serviceName || !services.hasOwnProperty(serviceName)) return null;
    return services[serviceName as ServiceNames];
  }, [serviceName]);

  const [state, setState] = useState<OAuthState>('inprogress');

  useEffect(() => {
    if (!service || !service.hasOAuth) return;
    const effect = async () => {
      const ok = await service.authorize();
      setState(ok ? 'success' : 'failed');
      if (ok) {
        const list = await get(service);
        setBadge(service.name, list.data.length);
      }
    };
    effect();
  }, [service]);

  useEffect(() => {
    if (state !== 'success') return;
    createContextMenus();
  });

  return (
    <ServiceContext.Provider value={service}>
      {service !== null && (
        <div>
          <div className="my-10 flex justify-center p-3 text-lg">
            {state === 'inprogress' && <div>Trying to get {service.name}'s authorization...</div>}
            {state === 'failed' && (
              <div>Please authorize "Pile" in {service.name} in order to work.</div>
            )}
            {state === 'success' && <Connected />}
          </div>
          <Footer />
        </div>
      )}
    </ServiceContext.Provider>
  );
};
