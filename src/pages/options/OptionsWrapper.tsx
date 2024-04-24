import { FC, useCallback, useEffect, useState } from 'react';
import { Checkbox } from '@e-krebs/react-library';

import { ConnectionStatus } from 'components/ConnectionStatus';
import { type Service } from 'utils/services';
import { serviceVars } from 'helpers/vars';
import { getFromLocalStorage, setToLocalStorage } from 'helpers/localstorage';
import { updateBadge } from 'utils/badge';
import { type ServiceNames } from 'services';

export const OptionsWrapper: FC<{ service: Service }> = ({ service }) => {
  const Children = service.hasOAuth ? ConnectionStatus : service.Setup;
  const [isActive, setIsActive] = useState(true);
  const [showCount, setShowCount] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const toggleShowCount = useCallback(() => {
    setShowCount((value) => {
      const newValue = !value;
      getFromLocalStorage<Partial<Record<ServiceNames, boolean>>>(serviceVars.showCountOnBadge).then(
        async (allValues = {}) => {
          allValues[service.name] = newValue;
          await setToLocalStorage(serviceVars.showCountOnBadge, allValues);
          await updateBadge();
        }
      );
      return newValue;
    });
  }, [service.name]);

  const toggleIsActive = useCallback(() => {
    setIsActive((value) => {
      const newValue = !value;
      getFromLocalStorage<Partial<Record<ServiceNames, boolean>>>(serviceVars.active).then(
        async (activeValues = {}) => {
          activeValues[service.name] = newValue;
          await setToLocalStorage(serviceVars.active, activeValues);
          if (showCount) {
            toggleShowCount();
          }
        }
      );
      return newValue;
    });
  }, [service.name, showCount, toggleShowCount]);

  useEffect(() => {
    getFromLocalStorage<Partial<Record<ServiceNames, boolean>>>(serviceVars.showCountOnBadge)
      .then((allValues = {}) => {
        const initialValue = allValues[service.name] ?? true;
        setShowCount(initialValue);
      })
      .then(() => getFromLocalStorage<Partial<Record<ServiceNames, boolean>>>(serviceVars.active))
      .then((activeValues = {}) => {
        setIsActive(activeValues[service.name] === false ? false : true);
        setIsLoading(false);
      });
  }, [service.name, toggleShowCount, showCount]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-y-6 p-3">
        {!isLoading && (
          <>
            <Checkbox
              label={`Enable ${service.name}`}
              defaultSelected={isActive}
              onChange={toggleIsActive}
              isDisabled={!service.isTogglable}
            />
            {isActive && (
              <Checkbox
                label={`Show ${service.name} count on badge`}
                defaultSelected={showCount}
                onChange={toggleShowCount}
              />
            )}
          </>
        )}
      </div>
      {isActive && <Children context="options" />}
    </div>
  );
};
