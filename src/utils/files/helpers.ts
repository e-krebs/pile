import { logAndReject } from 'utils/logAndReject';
import type { Path } from 'utils/typings';

let fsRoot: FileSystemDirectoryEntry | null = null;

const rootFolder = 'storage';

export const getFileUrl = async (path: Path): Promise<string> => {
  const fsRoot = await getFilesystem();
  return fsRoot.toURL() + `${rootFolder}/` + path.join('/');
};

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
      (error) => {
        logAndReject(error, 'getFilesystem', reject);
      },
    );
  });
};

const getFolder = async (
  parentDir: FileSystemDirectoryEntry,
  path: string,
): Promise<FileSystemDirectoryEntry> => {
  return await new Promise((resolve, reject) => {
    parentDir.getDirectory(
      path,
      { create: true },
      (directory) => resolve(directory),
      (error) => {
        logAndReject(error, `getFolder ${path}`, reject);
      },
    );
  });
};

export const getFileFromPath = async (paths: Path): Promise<[FileSystemDirectoryEntry, string]> => {
  let folder = await getFilesystem();
  const folders = [rootFolder, ...paths.slice(0, -1)];
  const file = paths[paths.length - 1];
  for (const path of folders) {
    folder = await getFolder(folder, path);
  }
  return [folder, file];
};
