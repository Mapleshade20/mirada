/**
 * Detects if the current browser is WeChat's in-app browser
 * @returns true if the user agent contains "MicroMessenger"
 */
export const isWeChatBrowser = (): boolean => {
  if (typeof window === "undefined" || !window.navigator) {
    return false;
  }
  return /MicroMessenger/i.test(window.navigator.userAgent);
};
