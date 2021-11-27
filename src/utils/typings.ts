export type Response<T> = {
  ok: true;
  result: T;
} | {
  ok: false;
}

export interface BlobInfo {
  blob: Blob;
  blobPath: string[];
}
