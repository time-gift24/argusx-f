interface IdleCallbackWindow extends Window {
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
}

export const scheduleDeferredRender = (
  callback: () => void,
  timeout = 500
): (() => void) => {
  if (typeof window !== 'undefined') {
    const idleWindow = window as IdleCallbackWindow;
    if (typeof idleWindow.requestIdleCallback === 'function') {
      const id = idleWindow.requestIdleCallback(() => callback(), { timeout });
      return () => idleWindow.cancelIdleCallback?.(id);
    }
  }

  const id = setTimeout(callback, 1);
  return () => clearTimeout(id);
};
