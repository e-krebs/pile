import Vibrant from 'node-vibrant';

import { readFile, readJson, writeBlob, writeJson, deleteFolder } from 'utils/files';
import { getBlob } from 'utils/get';
import { BlobInfo, Response } from 'utils/typings';
import { Palette, resolvePalette } from './palette';

const iconFolder = 'icons';

const getIconBlob = async (
  hostname: string,
  fallback: string | null
): Promise<Response<BlobInfo>> => {
  let res = await getBlob({
    url: `https://www.google.com/s2/favicons?domain=${hostname}&alt=404`
  });
  if (res.ok) return res;

  res = await getBlob({ url: `https://img.readitlater.com/i/${hostname}/favicon.ico` });
  if (res.ok) return res;

  if (fallback != null) {
    res = await getBlob({ url: fallback });
    if (res.ok) return res;
  }

  return { ok: false };
};

export interface IconAndPalette {
  url: string;
  palette: Palette;
}

const getPalette = async (url: string, palettePath: string[]): Promise<IconAndPalette> => {
  let palette = await readJson<Palette>(palettePath);
  if (palette) return { url, palette };

  return new Promise((resolve) => {
    const img = document.createElement('img');
    img.setAttribute('src', url);
    img.addEventListener('load', async () => {
      palette = resolvePalette(await Vibrant.from(img).getPalette());
      await writeJson(palettePath, palette);
      resolve({ url, palette });
    });
  });
};

export const getIcon = async (
  hostname: string,
  fallback: string | null = null
): Promise<IconAndPalette | undefined> => {
  const imageName = [iconFolder, `${hostname}.png`];
  const paletteName = [iconFolder, `${hostname}_palette.json`];

  try {
    let imageUrl = await readFile(imageName);
    if (imageUrl !== null) return getPalette(imageUrl, paletteName);

    const res = await getIconBlob(hostname, fallback);
    if (!res.ok) return;

    imageUrl = await writeBlob({ blob: res.result.blob, blobPath: imageName });
    if (imageUrl === null) return;

    return getPalette(imageUrl, paletteName);
  } catch {
    return;
  }
};

export const cleanIcons = async (): Promise<true> => await deleteFolder([iconFolder]);
