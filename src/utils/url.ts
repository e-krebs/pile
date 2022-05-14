export const beautifyUrl = (url: string): string =>
  url.replace(/^http(?:s)?:\/\/(www.)?/, '').replace(/\/$/, '');
