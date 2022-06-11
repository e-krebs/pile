import cx from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Archive, Plus, Trash2 } from 'react-feather';

import { getService, type Service } from 'utils/services';
import { type Message } from 'utils/messages';
import { getMatchingId } from 'utils/currentUrlIsMatching';
import { Button } from 'components/Button';
import { Modal, ModalContext } from 'components/Modal';

export const Page = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [closing, setClosing] = useState(false);
  const [doneVisible, setDoneVisible] = useState(false);
  const [service, setService] = useState<Service>();
  const [url, setUrl] = useState<string>();
  const [matchingId, setMatchingId] = useState<string>();

  const closeModal = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setMatchingId(undefined);
      setDoneVisible(false);
      modalRef.current?.close();
    }, 150);
  }, []);

  const onModalBackdropClick = useCallback(
    (event: HTMLElementEventMap['click']) => {
      if (!modalRef.current) return;
      const rect = modalRef.current.getBoundingClientRect();
      const isInDialog =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!isInDialog && (event.target as Element).tagName.toLowerCase() === 'dialog') {
        closeModal();
      }
    },
    [closeModal]
  );

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
            setClosing(false);
            modalRef.current?.removeEventListener('click', onModalBackdropClick);
            modalRef.current?.showModal();
            modalRef.current?.addEventListener('click', onModalBackdropClick);
          }
          sendMessage();
        }
      }
    };

    chrome.runtime.onMessage.addListener(onMessageListener);
    return () => {
      chrome.runtime.onMessage.removeListener(onMessageListener);
    };
  }, [onModalBackdropClick]);

  const done = useCallback(() => {
    setDoneVisible(true);
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

  return (
    <ModalContext.Provider value={{ closeModal, modalRef }}>
      {service && url && (
        <Modal
          title={`pile for ${service.name}`}
          contentProps={{
            id: 'pile-content',
            className: closing ? 'animate-blowDownModal' : 'animate-blowUpModal',
          }}
        >
          <div
            className={cx(
              'absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-lg bg-white text-[5rem] font-bold text-green-500 transition-opacity dark:bg-gray-900',
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
      )}
    </ModalContext.Provider>
  );
};
