export const scheduleDeferredRender = (
  callback: () => void,
  timeout = 500
): (() => void) => {
  if (
    typeof window !== 'undefined' &&
    typeof window.requestIdleCallback === 'function' &&
    typeof window.cancelIdleCallback === 'function'
  ) {
    const id = window.requestIdleCallback(() => callback(), { timeout });
    return () => window.cancelIdleCallback(id);
  }

  const id = setTimeout(callback, 1);
  return () => clearTimeout(id);
};
