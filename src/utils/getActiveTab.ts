export const getActiveTab = async (): Promise<string | undefined> => {
  const tabs = await chrome.tabs.query({ active: true });
  const url = tabs.length > 0 ? tabs[0].url : undefined;
  return url;
};
