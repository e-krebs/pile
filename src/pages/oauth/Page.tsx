import { FC, useMemo, useState } from 'react';
import { useAsyncEffect } from 'use-async-effect';

import { Footer } from 'components/Footer';
import { services, ServiceNames } from 'services';
import type { ServiceType } from 'utils/services';
import { Connected } from 'components/Connected';

type OAuthState = 'inprogress' | 'failed' | 'success';

interface PageProps {
  serviceName?: string | null;
}

export const Page: FC<PageProps> = ({ serviceName }) => {
  const service: ServiceType | null = useMemo(() => {
    if (!serviceName || !services.hasOwnProperty(serviceName)) return null;
    return services[serviceName as ServiceNames];
  }, [serviceName]);

  const [state, setState] = useState<OAuthState>('inprogress');

  useAsyncEffect(async () => {
    if (!service) return;
    const ok = await service.authorize();
    setState(ok ? 'success' : 'failed');
    if (ok) {
      await service.get();
    }
  }, []);

  return service === null ? null : (
    <div>
      <div className="flex justify-center p-3 my-10 text-lg">
        {state === 'inprogress' && (
          <div>
            Trying to get {service.name}'s authorization...
          </div>
        )}
        {state === 'failed' && (
          <div>
            Please authorize "Pile" in {service.name} in order to work.
          </div>
        )}
        {state === 'success' && <Connected name={service.name} />}
      </div>
      <Footer />
    </div>
  );
};
