import { getEnvVar } from 'helpers/env';

export const isConnected = (): boolean =>
  Boolean(localStorage.pocketCode)
  && Boolean(localStorage.pocketToken)
  && Boolean(localStorage.pocketUsername);

export const getPocketKey = (): string | undefined => getEnvVar('pocketKey');
export const getPocketRedirectUri = (): string =>
  chrome.extension.getURL('services/pocket/oauth.html');

export const getPocketCode = (): string | undefined => localStorage.pocketCode;
export const setPocketCode = (code: string): void => {
  localStorage.pocketCode = code;
};

export const getPocketToken = (): string | undefined => localStorage.pocketToken;
export const setPocketToken = (token: string): void => {
  localStorage.pocketToken = token;
};

export const getPocketUsername = (): string | undefined => localStorage.pocketUsername;
export const setPocketUsername = (username: string): void => {
  localStorage.pocketUsername = username;
};
