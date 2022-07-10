import { Modal, type ModalRef } from '@e-krebs/react-library';
import cx from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Archive, Plus, Trash2 } from 'react-feather';

import { getService, type Service } from 'utils/services';
import { type Message } from 'utils/messages';
import { getMatchingId } from 'utils/currentUrlIsMatching';
import { Button } from 'components/Button';

export const Page = () => {
  const modalRef = useRef<ModalRef>(null);
  const [doneVisible, setDoneVisible] = useState(false);
  const [service, setService] = useState<Service>();
  const [url, setUrl] = useState<string>();
  const [matchingId, setMatchingId] = useState<string>();

  const onClosed = () => {
    setMatchingId(undefined);
    setDoneVisible(false);
  };

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
            modalRef.current?.openModal();
          }
          sendMessage();
        }
      }
    };

    chrome.runtime.onMessage.addListener(onMessageListener);
    return () => {
      chrome.runtime.onMessage.removeListener(onMessageListener);
    };
  }, []);

  const done = useCallback(() => {
    setDoneVisible(true);
    if (modalRef.current) {
      setTimeout(modalRef.current.closeModal, 300);
    }
  }, []);

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

  return service && url ? (
    <Modal
      ref={modalRef}
      onClosed={onClosed}
      title={`pile for ${service.name}`}
      contentProps={{ id: 'pile-content', className: 'items-center space-y-4' }}
    >
      <div
        className={cx(
          'absolute top-0 left-0 !my-8 flex h-[calc(100%-4rem)] w-full items-center justify-center rounded-lg bg-white text-[5rem] font-bold text-green-500 transition-opacity dark:bg-gray-900',
          doneVisible ? 'opacity-1 visible' : 'invisible opacity-0'
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
  ) : null;
};
