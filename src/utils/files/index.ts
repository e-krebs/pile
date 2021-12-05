import type { BlobInfo, Path } from 'utils/typings';
import { getFileFromPath, getFileUrl } from './helpers';

// @ts-expect-error webkit specific varian
window.resolveLocalFileSystemURL = window.webkitResolveLocalFileSystemURL;

export const getJsonKey = (key: string) => `${key}.json`;

export const readFile = async (path: Path): Promise<string | null> => {
  const url = await getFileUrl(path);
  return new Promise((resolve) => {
    window.resolveLocalFileSystemURL(
      url,
      () => { resolve(url); },
      () => { resolve(null); }
    );
  });
};

export const readJson = async <T>(path: Path): Promise<T | null> => {
  const url = await getFileUrl(path);
  return new Promise((resolve) => {
    window.resolveLocalFileSystemURL(
      url,
      (file) => {
        (file as FileSystemFileEntry).file((blob) => {
          const reader = new FileReader();
          reader.onloadend = function () {
            try {
              const json = JSON.parse(`${this.result}`) as T;
              resolve(json);
            } catch {
              resolve(null);
            }
          };
          reader.readAsText(blob);
        });
      },
      () => { resolve(null); }
    );
  });
};

export const writeBlob = async (blobinfo: BlobInfo): Promise<string | null> => {
  const { blob, blobPath } = blobinfo;
  const [directory, fileName] = await getFileFromPath(blobPath);
  const url = await getFileUrl(blobPath);
  await deleteFile(blobPath);
  return new Promise((resolve, reject) => {
    directory.getFile(
      fileName,
      { create: true, exclusive: false },
      (file) => {
        if (!file.isFile) {
          reject(null);
        } else {
          // Create a FileWriter object for our FileEntry, and write our blob.
          file.createWriter(
            (writer) => {
              writer.onwriteend = () => { resolve(url); };
              writer.write(blob);
            },
            () => reject
          );
        }
      },
      () => reject
    );
  });
};

export const writeJson = async <T = unknown>(path: Path, json: T): Promise<string | null> => {
  const data = JSON.stringify(json);
  const blob = new Blob([data], { type: 'application/json' });
  return await writeBlob({ blob, blobPath: path });
};

const deleteFile = async (url: Path): Promise<true> => {
  const [directory, file] = await getFileFromPath(url);
  return new Promise<true>((resolve, reject) => {
    directory.getFile(
      file,
      { create: false },
      (file) => {
        file.remove(() => { resolve(true); }, () => reject);
      },
      () => { resolve(true); /* file doesn't exist */ }
    );
  });
};

export const deleteFolder = async (path: Path): Promise<true> => {
  const [directory] = await getFileFromPath([...path, '']);
  return new Promise<true>((resolve, reject) => {
    directory.removeRecursively(
      () => { resolve(true); },
      () => reject
    );
  });
};

export const deleteJson = async (key: string): Promise<true> => {
  const path = getJsonKey(key);
  return await deleteFile([path]);
};

export const deleteBlob = async (blobinfo: BlobInfo): Promise<true> => {
  const { blobPath: blobUrl } = blobinfo;
  return await deleteFile(blobUrl);
};
