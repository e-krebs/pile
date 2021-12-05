import Vibrant from 'node-vibrant';

import { readFile, readJson, writeBlob, writeJson, deleteFolder } from 'utils/files';
import { getBlob } from 'utils/getBlob';
import type { BlobInfo, Path, Response } from 'utils/typings';
import { getTimestamp, isCacheExpired, JsonCache } from './dataCache';
import { Palette, resolvePalette } from './palette';

const iconFolder = 'icons';
const noIconsFile: Path = [iconFolder, 'noIcons.json'];

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

const getPalette = async (url: string, palettePath: Path): Promise<IconAndPalette> => {
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

type ExcludedIcon = JsonCache<string>;

const clearExcludedIcons = async (icons: ExcludedIcon[] = []): Promise<ExcludedIcon[]> => {
  const cleared = [];
  let updated = false;
  for (const icon of icons) {
    if (!isCacheExpired(icon)) {
      cleared.push(icon);
      updated = true;
    }
  }
  if (updated) {
    await writeJson(noIconsFile, cleared);
  }
  return cleared;
};

const addExcludedIcon = async (hostname: string): Promise<void> => {
  const excludedIcons = (await readJson<ExcludedIcon[]>(noIconsFile)) ?? [];
  if (excludedIcons.map(icon => icon.data).includes(hostname)) return;
  const newList = await clearExcludedIcons(excludedIcons);
  await writeJson<ExcludedIcon[]>(
    noIconsFile,
    [...newList, { timestamp: getTimestamp(), data: hostname }]
  );
};

const getExcludedIcons = async (): Promise<string[]> => {
  const excludedIcons = (await readJson<ExcludedIcon[]>(noIconsFile)) ?? [];
  return (await clearExcludedIcons(excludedIcons)).map(icon => icon.data);
};

export const getIcon = async (
  hostname: string,
  fallback: string | null = null
): Promise<IconAndPalette | undefined> => {
  const imageName: Path = [iconFolder, `${hostname}.png`];
  const paletteName: Path = [iconFolder, `${hostname}_palette.json`];

  const excludedIcons = await getExcludedIcons();
  if (excludedIcons.includes(hostname)) return;

  try {
    let imageUrl = await readFile(imageName);
    if (imageUrl !== null) return getPalette(imageUrl, paletteName);

    const res = await getIconBlob(hostname, fallback);
    if (!res.ok) {
      await addExcludedIcon(hostname);
      return;
    }

    imageUrl = await writeBlob({ blob: res.result.blob, blobPath: imageName });
    if (imageUrl === null) return;

    return getPalette(imageUrl, paletteName);
  } catch {
    return;
  }
};

export const cleanIcons = async (): Promise<true> => await deleteFolder([iconFolder]);
