import { Modal, type ModalRef } from '@e-krebs/react-library';
import cx from 'classnames';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Archive, Plus, Tag, Trash2, X, XCircle } from 'react-feather';

import { getService, type Service } from 'utils/services';
import { type Message } from 'utils/messages';
import { getMatchingId } from 'utils/currentUrlIsMatching';
import { LoaderButton } from 'components/LoadingIcon';
import { Autocomplete, Option } from 'components/Autocomplete';

export const Page = () => {
  const modalRef = useRef<ModalRef>(null);
  const [doneVisible, setDoneVisible] = useState(false);
  const [service, setService] = useState<Service>();
  const [url, setUrl] = useState<string>();
  const [allTags, setAllTags] = useState<string[]>([]);
  const [matchingId, setMatchingId] = useState<string>();

  const [tags, setTags] = useState<string[]>([]);
  const [isAddTagsOpen, setIsAddTagsOpen] = useState(false);

  const addTag = useCallback((tag: string) => {
    setTags((tags) => [...tags, tag]);
    setIsAddTagsOpen(false);
  }, []);

  const removeTag = useCallback((tag: string) => {
    setTags((tags) => tags.filter((t) => t !== tag));
    setIsAddTagsOpen(false);
  }, []);

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
            setAllTags(message.tags ?? []);
            setTags([]);
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

  const Add = useMemo(() => (isAddTagsOpen ? XCircle : Plus), [isAddTagsOpen]);

  const options: Option[] = useMemo(
    () => allTags.filter((tag) => !tags.includes(tag)).map((value) => ({ value })),
    [allTags, tags]
  );

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
      {matchingId ? (
        <>
          <LoaderButton
            startIcon={Archive}
            className="w-max justify-self-center"
            options={{ disableLoader: true }}
            onClick={() => archiveItem(service, matchingId)}
          >
            Archive from {service.name}
          </LoaderButton>
          <LoaderButton
            startIcon={Trash2}
            className="w-max justify-self-center"
            options={{ disableLoader: true }}
            onClick={() => deleteItem(service, matchingId)}
          >
            Delete from {service.name}
          </LoaderButton>
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
          {allTags.length > 0 && (
            <div
              className={cx(
                'group flex cursor-default flex-col rounded-lg text-xs leading-4',
                isAddTagsOpen ? 'max-w-[calc(100%+1rem)]' : 'max-w-full',
                'transition-max-width hover:max-w-[calc(100%+1rem)]',
                'text-gray-900 dark:text-gray-100',
                'border-gray-900 dark:border-gray-100'
              )}
            >
              <div
                className={cx(
                  'flex items-center rounded-lg border bg-gray-100 px-2 py-1 dark:bg-gray-800',
                  'border-gray-400 text-gray-500 dark:text-gray-400'
                )}
              >
                <Tag className={cx('mt-[3px] mb-[2px] h-3 w-3 shrink-0')} />

                {tags.length > 0 && (
                  <div className="mt-[-1px] flex truncate border-inherit">
                    {tags.map((tag) => (
                      <div
                        key={tag}
                        className={cx(
                          'group ml-1 flex items-center pl-px',
                          'border-b border-transparent',
                          'cursor-pointer border-dashed'
                        )}
                        title={`remove tag [${tag}]`}
                        onClick={() => removeTag(tag)}
                      >
                        <span>{tag}</span>
                        <X
                          className={cx(
                            'mb-[-3px] h-3 transition-width group-hover:w-3',
                            isAddTagsOpen ? 'w-3' : 'w-0'
                          )}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div
                  className={cx('flex shrink-0 grow cursor-pointer justify-end')}
                  title={isAddTagsOpen ? 'close' : 'add tags'}
                  onClick={() => setIsAddTagsOpen(!isAddTagsOpen)}
                >
                  <Add
                    className={cx(
                      isAddTagsOpen ? 'w-3' : 'w-0',
                      'mb-[-1px] h-3 transition-width group-hover:ml-1 group-hover:w-3'
                    )}
                  />
                </div>
              </div>

              {isAddTagsOpen && (
                <Autocomplete
                  aria-label="new tag"
                  autoFocus
                  options={options}
                  className="border-gray-400 text-gray-500"
                  isLoading={false}
                  setIsLoading={() => {}}
                  close={() => setIsAddTagsOpen(false)}
                  addValueSync={addTag}
                />
              )}
            </div>
          )}
        </div>
      )}
    </Modal>
  ) : null;
};
