import { BlobInfo } from './typings';

let fsRoot: FileSystemDirectoryEntry | null = null;

// @ts-expect-error webkit specific varian
window.resolveLocalFileSystemURL = window.webkitResolveLocalFileSystemURL;

export const getJsonKey = (key: string) => `${key}.json`;

const getFilesystem = async (): Promise<FileSystemDirectoryEntry> => {
  return await new Promise((resolve, reject) => {
    if (fsRoot !== null) resolve(fsRoot);
    window.webkitRequestFileSystem(
      window.TEMPORARY,
      1024 * 1024,
      (localFs) => {
        fsRoot = localFs.root;
        resolve(fsRoot);
      },
      (err) => { reject(err); });
  });
};

const getFileURl = (path: string, fsRoot: FileSystemDirectoryEntry) =>
  fsRoot.toURL() + 'storage/' + path;

export const readFile = async (path: string): Promise<string | null> => {
  const fsRoot = await getFilesystem();
  return new Promise((resolve) => {
    const url = getFileURl(path, fsRoot);
    window.resolveLocalFileSystemURL(
      url,
      () => { resolve(url); },
      () => { resolve(null); }
    );
  });
};

export const readJson = async <T>(path: string): Promise<T | null> => {
  const fsRoot = await getFilesystem();
  return new Promise((resolve) => {
    const url = getFileURl(path, fsRoot);
    window.resolveLocalFileSystemURL(
      url,
      (file) => {
        (file as FileSystemFileEntry).file((blob) => {
          const reader = new FileReader();
          reader.onloadend = function() {
            const json = JSON.parse(`${this.result}`) as T;
            resolve(json);
          };
          reader.readAsText(blob);
        });
      },
      () => { resolve(null); }
    );
  });
};

export const writeBlob = async (blobinfo: BlobInfo): Promise<string | null> => {
  const { blob, blobUrl } = blobinfo;
  const fsRoot = await getFilesystem();
  return new Promise((resolve, reject) => {
    fsRoot.getDirectory(
      'storage',
      { create: true },
      (directory) => {
        directory.getFile(
          blobUrl,
          { create: true, exclusive: false },
          (file) => {
            if (!file.isFile) {
              reject(null);
            } else {
              // Create a FileWriter object for our FileEntry, and write our blob.
              file.createWriter(
                (writer) => {
                  writer.onwriteend = () => { resolve(getFileURl(blobUrl, fsRoot)); };
                  writer.write(blob);
                },
                () => reject
              );
            }
          },
          () => reject
        );
      },
      () => reject
    );
  });
};

export const writeJson = async <T = unknown>(path: string, json: T): Promise<string | null> => {
  const data = JSON.stringify(json);
  const blob = new Blob([data], {type: 'application/json'});
  return await writeBlob({ blob, blobUrl: path });
};

export const deleteFile = async (url: string): Promise<true> => {
  const fsRoot = await getFilesystem();
  return new Promise<true>((resolve, reject) => {
    fsRoot.getDirectory(
      'storage',
      { create: false },
      (directory) => {
        directory.getFile(
          url,
          { create: false },
          (file) => {
            file.remove(() => { resolve(true); }, () => reject);
          });
      }),
      () => reject;
  });
};

export const deleteJson = async (key: string): Promise<true> => {
  const path = getJsonKey(key);
  return await deleteFile(path);
};

export const deleteBlob = async (blobinfo: BlobInfo): Promise<true> => {
  const { blobUrl } = blobinfo;
  return await deleteFile(blobUrl);
};
