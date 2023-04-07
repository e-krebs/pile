import { Modal, type ModalRef } from '@e-krebs/react-library';
import cx from 'classnames';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Archive, Plus, Trash2 } from 'react-feather';

import { getService, type Service } from 'utils/services';
import { type Message } from 'utils/messages';
import { getMatchingListItem } from 'utils/currentUrlIsMatching';
import { LoaderButton } from 'components/LoadingIcon';
import { ListItem } from 'utils/typings';
import { Tags } from './Tags';

interface Matching {
  listItem: ListItem;
  service: Service;
}

export const Page = () => {
  const modalRef = useRef<ModalRef>(null);
  const [doneVisible, setDoneVisible] = useState(false);
  const [service, setService] = useState<Service>();
  const [url, setUrl] = useState<string>();
  const [allTags, setAllTags] = useState<string[]>([]);
  const [matching, setMatching] = useState<Matching | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const [tags, setTags] = useState<string[]>([]);

  const addTagSync = (tag: string) => setTags((tags) => [...tags, tag]);

  const addTagAsync = async (matching: Matching, value: string) => {
    const message: Message = {
      action: 'addTag',
      service: matching.service.name,
      id: matching.listItem.id,
      tag: value,
      url: matching.listItem.url,
    };
    await chrome.runtime.sendMessage(message);
  };

  const removeTagSync = (tag: string) => setTags((tags) => tags.filter((t) => t !== tag));

  const removeTagAsync = async (matching: Matching, value: string) => {
    const message: Message = {
      action: 'removeTag',
      service: matching.service.name,
      id: matching.listItem.id,
      tag: value,
      url: matching.listItem.url,
    };
    await chrome.runtime.sendMessage(message);
  };

  const onClosed = () => {
    setMatching(undefined);
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
            setAllTags(message.tags ?? []);
            setTags([]);
            const listItem = await getMatchingListItem(new URL(message.url), [msgService]);
            setMatching(listItem ? { service: msgService, listItem } : undefined);
            setIsLoading(false);
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
        tags,
      };
      chrome.runtime.sendMessage(message, done);
    },
    [done, tags]
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

  const pageSize: number = useMemo(() => {
    const fontSize = window
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .getComputedStyle(document.querySelector('html')!)
      .getPropertyValue('font-size');
    return parseFloat(fontSize) ?? 16;
  }, []);

  return service && url ? (
    <Modal
      ref={modalRef}
      onClosed={onClosed}
      title={`pile for ${service.name}`}
      contentProps={{ id: 'pile-content', className: 'items-center space-y-4' }}
      dialogProps={{ style: { transform: `scale(calc(16/${pageSize}))` } }}
    >
      <div
        className={cx(
          'absolute -top-px left-0 !my-6 flex h-[calc(100%-3rem+2px)] w-full items-center justify-center rounded-lg bg-white text-[5rem] font-bold text-green-500 transition-opacity dark:bg-gray-900',
          doneVisible ? 'opacity-1 visible' : 'invisible opacity-0'
        )}
      >
        ✓
      </div>
      {matching ? (
        <>
          <LoaderButton
            startIcon={Archive}
            className="w-max justify-self-center"
            options={{ disableLoader: true }}
            onClick={() => archiveItem(service, matching.listItem.id)}
          >
            Archive from {service.name}
          </LoaderButton>
          <LoaderButton
            startIcon={Trash2}
            className="w-max justify-self-center"
            options={{ disableLoader: true }}
            onClick={() => deleteItem(service, matching.listItem.id)}
          >
            Delete from {service.name}
          </LoaderButton>
          <Tags
            allTags={allTags}
            tags={matching.listItem.tags}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            addTag={(tag) => addTagAsync(matching, tag)}
            removeTag={(tag) => removeTagAsync(matching, tag)}
          />
        </>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <LoaderButton
            startIcon={Plus}
            className="w-max justify-self-center"
            options={{ disableLoader: true }}
            onClick={() => addItem(service, url)}
          >
            Add to {service.name}
          </LoaderButton>
          <Tags
            allTags={allTags}
            tags={tags}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            addTagSync={addTagSync}
            removeTagSync={removeTagSync}
          />
        </div>
      )}
    </Modal>
  ) : null;
};
