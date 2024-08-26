import { extractColors } from 'extract-colors';

import { readFile, readJson, writeBlob, writeJson, deleteFolder, deleteFile } from 'utils/files';
import { getBlob } from 'utils/getBlob';
import type { BlobInfo, Path, Response } from 'utils/typings';

import { getTimestamp, isCacheExpired, JsonCache } from './dataCache';
import { RGB, getRgb } from './palette';
import { getFirstBy } from './getFirstBy';

const iconFolder = 'icons';

const getIconBlob = async (hostname: string, fallback: string | null): Promise<Response<BlobInfo>> => {
  let res = await getBlob({
    url: `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&url=${hostname}&size=32`,
  });
  if (res.ok) return res;

  res = await getBlob({ url: `https://logo.clearbit.com/${hostname}?size=32` });
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
  palette: RGB | undefined;
}

const getPalette = async (url: string, palettePath: Path): Promise<IconAndPalette> => {
  const palette = await readJson<RGB | undefined>(palettePath);

  return {
    url,
    palette: palette ?? getRgb(getFirstBy(await extractColors(url), 'area')),
  };
};

type ExcludedIcon = JsonCache<string>;

const getNoImageName = (hostname: string): Path => [iconFolder, `${hostname}.json`];

const addExcludedIcon = async (hostname: string): Promise<void> => {
  const json: ExcludedIcon = {
    timestamp: getTimestamp(),
    data: hostname,
  };
  await writeJson(getNoImageName(hostname), json);
};

const isExcludedIcon = async (hostname: string): Promise<boolean> => {
  const path = getNoImageName(hostname);
  const excludedIcon = await readJson<ExcludedIcon>(path);
  if (!excludedIcon) return false;
  if (isCacheExpired(excludedIcon)) {
    await deleteFile(path);
    return false;
  }
  return true;
};

export const getIcon = async (
  hostname: string,
  fallback: string | null = null
): Promise<IconAndPalette | undefined> => {
  const imageName: Path = [iconFolder, `${hostname}.png`];
  const paletteName: Path = [iconFolder, `${hostname}_palette_02.json`];

  try {
    if (await isExcludedIcon(hostname)) return;

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
