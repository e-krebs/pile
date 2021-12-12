export const logAndReject = (
  error: Error,
  identifier: string,
  reject: (reason?: unknown) => void
): void => {
  console.warn(`[${identifier}] rejected with the following error:`, error);
  reject();
};
