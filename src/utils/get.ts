import type { BlobInfo, Response } from './typings';

interface GetParams {
  url: string;
}

export const getBlob = async ({ url }: GetParams): Promise<Response<BlobInfo>> => {
  const response = await fetch(url);
  if (!response.ok) return { ok: false };
  const blob = (await response.blob());
  const blobUrl = URL.createObjectURL(blob);
  return { ok: true, result: { blob, blobPath: [blobUrl] } };
};
