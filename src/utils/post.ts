import type { Response } from './typings';

interface PostParams {
  url: string;
  headers: Record<string, string>;
  params: Record<string, unknown>;
}

export const post = async <T>({ url, headers, params }: PostParams): Promise<Response<T>> => {
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(params),
  });
  if (!response.ok) {
    return { ok: false };
  }
  const result = (await response.json()) as T;
  return {
    ok: true,
    result,
  };
};
