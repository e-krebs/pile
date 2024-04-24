import { getServices } from './services';

export const createContextMenus = async () => {
  await new Promise((resolve) => {
    chrome.contextMenus.removeAll(() => {
      resolve(true);
    });
  });
  await Promise.all(
    getServices().map(async (service) => {
      if (!service.isUpdatable) return;

      const isConnected = await service.isConnected();
      if (!isConnected) return;

      chrome.contextMenus.create({
        id: service.name,
        title: `pile for ${service.name}`,
        type: 'normal',
        contexts: ['page'],
      });
    })
  );
};
