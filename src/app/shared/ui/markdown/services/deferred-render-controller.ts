export interface DeferredRenderOptions {
  debounceMs?: number;
  idleTimeout?: number;
}

export const scheduleDeferredRender = (
  callback: () => void,
  options: DeferredRenderOptions = {}
): (() => void) => {
  const debounceMs = options.debounceMs ?? 300;
  const idleTimeout = options.idleTimeout ?? 500;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let fallbackIdleTimer: ReturnType<typeof setTimeout> | null = null;

  if (
    typeof window !== 'undefined' &&
    typeof window.requestIdleCallback === 'function' &&
    typeof window.cancelIdleCallback === 'function'
  ) {
    let idleId: number | null = null;
    debounceTimer = setTimeout(() => {
      idleId = window.requestIdleCallback(() => callback(), {
        timeout: idleTimeout,
      });
    }, debounceMs);

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      if (idleId !== null) {
        window.cancelIdleCallback(idleId);
      }
    };
  }

  debounceTimer = setTimeout(() => {
    fallbackIdleTimer = setTimeout(callback, 1);
  }, debounceMs);

  return () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    if (fallbackIdleTimer) {
      clearTimeout(fallbackIdleTimer);
    }
  };
};
