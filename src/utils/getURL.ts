export const getUrl = (url: string): URL => {
  try {
    return new URL(url);
  } catch {
    // very basic, should probably be improved
    return new URL(`https://${url}`);
  }
};
