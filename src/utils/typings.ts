export type Response<T> = {
  ok: true;
  result: T;
} | {
  ok: false;
}

export interface BlobInfo {
  blob: Blob;
  blobPath: Path;
}

export type Path = [string, ...string[]];

export interface ListItem {
  id: string;
  title: string;
  url: string;
  logo?: string
}
