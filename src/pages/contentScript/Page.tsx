import cx from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { Archive, Plus, Trash2 } from 'react-feather';

import { getService, type Service } from 'utils/services';
import { type Message } from 'utils/messages';
import { getMatchingId } from 'utils/currentUrlIsMatching';
import { Button } from 'components/Button';
import { Modal, ModalContext } from 'components/Modal';

export const Page = () => {
  const [closing, setClosing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [service, setService] = useState<Service>();
  const [url, setUrl] = useState<string>();
  const [matchingId, setMatchingId] = useState<string>();

  useEffect(() => {
    const onMessageListener = async (message: Message, _: unknown, sendMessage: () => void) => {
      switch (message.action) {
        case 'service': {
          const msgService = getService(message.service);
          if (msgService && message.url) {
            setService(msgService);
            setUrl(message.url);
            const id = await getMatchingId(new URL(message.url), [msgService]);
            setMatchingId(id);
          }
          sendMessage();
        }
      }
    };

    chrome.runtime.onMessage.addListener(onMessageListener);
    return () => {
      chrome.runtime.onMessage.removeListener(onMessageListener);
    };
  });

  const closeModal = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setService(undefined);
      setUrl(undefined);
      setMatchingId(undefined);
      setIsDone(false);
      setClosing(false);
    }, 150);
  }, []);

  const done = useCallback(() => {
    setIsDone(true);
    setTimeout(closeModal, 300);
  }, [closeModal]);

  const addItem = useCallback(
    (service: Service, url: string) => {
      const message: Message = {
        action: 'addToService',
        service: service.name,
        url,
      };
      chrome.runtime.sendMessage(message, done);
    },
    [done]
  );

  const archiveItem = useCallback(
    (service: Service, id: string) => {
      const message: Message = {
        action: 'archiveFromService',
        service: service.name,
        id,
      };
      chrome.runtime.sendMessage(message, done);
    },
    [done]
  );

  const deleteItem = useCallback(
    (service: Service, id: string) => {
      const message: Message = {
        action: 'deleteFromService',
        service: service.name,
        id,
      };
      chrome.runtime.sendMessage(message, done);
    },
    [done]
  );

  if (!service || !url) {
    return null;
  }

  return (
    <ModalContext.Provider value={{ closing, closeModal }}>
      <Modal id="pile-body" title={`pile for ${service.name}`} contentProps={{ id: 'pile-content' }}>
        <div
          className={cx(
            'absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-lg bg-white text-[5rem] font-bold text-green-500 transition-opacity dark:bg-gray-900',
            isDone ? 'opacity-1 visible' : 'invisible opacity-0'
          )}
        >
          ✓
        </div>
        {matchingId ? (
          <>
            <Button
              startIcon={Archive}
              className="w-max justify-self-center"
              options={{ disableLoader: true }}
              onClick={() => archiveItem(service, matchingId)}
            >
              Archive from {service.name}
            </Button>
            <Button
              startIcon={Trash2}
              className="w-max justify-self-center"
              options={{ disableLoader: true }}
              onClick={() => deleteItem(service, matchingId)}
            >
              Delete from {service.name}
            </Button>
          </>
        ) : (
          <Button
            startIcon={Plus}
            className="w-max justify-self-center"
            options={{ disableLoader: true }}
            onClick={() => addItem(service, url)}
          >
            Add to {service.name}
          </Button>
        )}
      </Modal>
    </ModalContext.Provider>
  );
};
