let fsRoot: FileSystemDirectoryEntry | null = null;

const rootFolder = 'storage';

export const getFileUrl = async (path: string[]): Promise<string> => {
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
      (err) => { reject(err); });
  });
};

const getFolder = async (
  parentDir: FileSystemDirectoryEntry,
  path: string
): Promise<FileSystemDirectoryEntry> => {
  return await new Promise((resolve, reject) => {
    parentDir.getDirectory(
      path,
      { create: true },
      (directory) => resolve(directory),
      () => reject,
    );
  });
};

export const getFileFromPath = async (
  paths: string[]
): Promise<[FileSystemDirectoryEntry, string]> => {
  let folder = await getFilesystem();
  const folders = [rootFolder, ...paths.slice(0, -1)];
  const file = paths[paths.length - 1];
  for (const path of folders) {
    folder = await getFolder(folder, path);
  }
  return [folder, file];
};