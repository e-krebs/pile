import { getMatchingId } from 'utils/currentUrlIsMatching';
import { Message } from 'utils/messages';
import { getService, Service } from 'utils/services';

const animationDuration = 150;

const createServiceButton = () => {
  const button = document.createElement('button');
  button.style.width = 'max-content';
  button.style.justifySelf = 'center';
  button.style.padding = '0.5rem';
  button.style.border = '1px solid rgb(63, 63, 70)';
  button.style.borderRadius = '0.5rem';
  return button;
};

const openServiceModal = async (url: string, service: Service) => {
  const matchingId = await getMatchingId(new URL(url), [service]);

  const modalBackground = document.createElement('div');
  modalBackground.style.position = 'fixed';
  modalBackground.style.top = '0';
  modalBackground.style.left = '0';
  modalBackground.style.width = '100vw';
  modalBackground.style.height = '100vh';
  modalBackground.style.zIndex = '9999';
  modalBackground.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  modalBackground.style.color = 'white';
  document.body.appendChild(modalBackground);

  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '33%';
  modal.style.left = 'calc(50% - 10rem)';
  modal.style.width = '16rem';
  modal.style.backgroundColor = 'white';
  modal.style.borderRadius = '0.5rem';
  modal.style.padding = '1rem';
  modal.style.color = 'rgb(113, 113, 122)';
  modal.style.zIndex = '9999';
  modal.style.display = 'grid';
  modal.style.rowGap = '1rem';
  modal.style.fontSize = '1rem';
  modal.style.lineHeight = '1.5rem';
  modal.style.fontFamily = 'Arial, sans-serif';
  modal.style.animation = `blowUpModal ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;

  const closeModal = () => {
    modal.style.animation = `blowDownModal ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    setTimeout(() => {
      document.body.removeChild(modal);
      document.body.removeChild(modalBackground);
    }, 150);
  };

  modalBackground.onclick = closeModal;

  const css = document.createElement('style');
  css.innerHTML = `
    button:hover { background-color: rgb(228, 228, 231) }
    button {
      font-size: 1rem;
      line-height: 1.5rem;
      background-color: white;
      color: rgb(113, 113, 122);
      cursor: pointer;
    }
    
    @keyframes blowUpModal {
      0% {
        transform:scale(0);
      }
      100% {
        transform:scale(1);
      }
    }

    @keyframes blowDownModal {
      0% {
        transform:scale(1);
        opacity:1;
      }
      100% {
        transform:scale(0);
        opacity:0;
      }
    }
  `;
  modal.appendChild(css);

  const modalClose = document.createElement('button');
  modalClose.innerText = '✕';
  modalClose.style.position = 'absolute';
  modalClose.style.right = '0';
  modalClose.style.padding = '0.25rem';
  modalClose.style.width = '2rem';
  modalClose.style.height = '2rem';
  modalClose.style.borderRadius = '100%';
  modalClose.style.borderColor = 'transparent';
  modalClose.style.border = '0';
  modalClose.onclick = closeModal;
  modal.appendChild(modalClose);

  const modalTitle = document.createElement('h1');
  modalTitle.style.border = '0';
  modalTitle.innerText = `pile for ${service.name}`;
  modalTitle.style.textAlign = 'center';
  modalTitle.style.padding = '0.75rem 2rem 0 2rem';
  modalTitle.style.textTransform = 'capitalize';
  modalTitle.style.fontSize = '1.25rem';
  modalTitle.style.fontWeight = '700';
  modal.appendChild(modalTitle);

  const doneDiv = document.createElement('div');
  doneDiv.style.width = '100%';
  doneDiv.style.height = '100%';
  doneDiv.style.position = 'absolute';
  doneDiv.style.top = '0';
  doneDiv.style.left = '0';
  doneDiv.style.backgroundColor = 'white';
  doneDiv.style.borderRadius = '0.5rem';
  doneDiv.style.display = 'flex';
  doneDiv.style.alignItems = 'center';
  doneDiv.style.justifyContent = 'center';
  doneDiv.style.lineHeight = '5rem';
  doneDiv.style.fontSize = '5rem';
  doneDiv.style.opacity = '0';
  doneDiv.style.color = '#22c55e'; // green-500
  doneDiv.style.visibility = 'hidden';
  doneDiv.style.transitionProperty = 'opacity';
  doneDiv.style.transitionTimingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)';
  doneDiv.style.transitionDuration = `${animationDuration}ms`;
  doneDiv.innerText = '✔';
  modal.appendChild(doneDiv);

  const done = () => {
    doneDiv.style.visibility = 'visible';
    doneDiv.style.opacity = '1';
    setTimeout(closeModal, animationDuration * 2);
  };

  if (matchingId) {
    const archiveItem = createServiceButton();
    archiveItem.innerText = `Archive from ${service.name}`;
    archiveItem.onclick = () => {
      const message: Message = {
        action: 'archiveFromService',
        service: service.name,
        id: matchingId,
      };
      chrome.runtime.sendMessage(message, done);
    };
    modal.appendChild(archiveItem);

    const deleteItem = createServiceButton();
    deleteItem.innerText = `Delete from ${service.name}`;
    deleteItem.onclick = () => {
      const message: Message = {
        action: 'deleteFromService',
        service: service.name,
        id: matchingId,
      };
      chrome.runtime.sendMessage(message, done);
    };
    modal.appendChild(deleteItem);
  } else {
    const addItem = createServiceButton();
    addItem.innerText = `Add to ${service.name}`;
    addItem.onclick = () => {
      const message: Message = {
        action: 'addToService',
        service: service.name,
        url,
      };
      chrome.runtime.sendMessage(message, done);
    };
    modal.appendChild(addItem);
  }

  document.body.appendChild(modal);
};

const onMessageListener = (message: Message, _: unknown, sendMessage: () => void) => {
  switch (message.action) {
    case 'service': {
      const service = getService(message.service);
      if (service) {
        openServiceModal(message.url, service);
      }
      sendMessage();
    }
  }
};

chrome.runtime.onMessage.addListener(onMessageListener);
