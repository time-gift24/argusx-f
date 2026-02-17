export interface StreamUpdateCoalescer {
  push(value: string): void;
  flush(): void;
  destroy(): void;
}

export const createStreamUpdateCoalescer = (
  emit: (value: string) => void,
  throttleMs = 120,
  debounceMs = 24
): StreamUpdateCoalescer => {
  let lastRun = Date.now();
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pending: string | null = null;

  const run = (value: string) => {
    emit(value);
    lastRun = Date.now();
  };

  return {
    push(value: string) {
      pending = value;
      const now = Date.now();
      const elapsed = now - lastRun;
      if (timer) {
        clearTimeout(timer);
      }

      if (elapsed >= throttleMs) {
        run(value);
        pending = null;
        return;
      }

      timer = setTimeout(() => {
        if (pending !== null) {
          run(pending);
        }
        pending = null;
      }, debounceMs);
    },
    flush() {
      if (timer) {
        clearTimeout(timer);
      }
      if (pending !== null) {
        run(pending);
      }
      pending = null;
      timer = null;
    },
    destroy() {
      if (timer) {
        clearTimeout(timer);
      }
      timer = null;
      pending = null;
    },
  };
};
