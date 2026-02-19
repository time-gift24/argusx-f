import { describe, expect, it, vi } from 'vitest';
import { scheduleDeferredRender } from './deferred-render-controller';

describe('scheduleDeferredRender', () => {
  it('schedules callback via idle queue', () => {
    vi.useFakeTimers();
    const called: string[] = [];
    scheduleDeferredRender(() => called.push('run'), {
      debounceMs: 50,
      idleTimeout: 50,
    });
    vi.advanceTimersByTime(60);
    expect(called).toEqual(['run']);
    vi.useRealTimers();
  });
});
