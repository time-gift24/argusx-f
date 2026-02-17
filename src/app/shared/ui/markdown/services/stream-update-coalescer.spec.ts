import { describe, expect, it, vi } from 'vitest';
import { createStreamUpdateCoalescer } from './stream-update-coalescer';

describe('createStreamUpdateCoalescer', () => {
  it('coalesces rapid updates and emits the latest value', () => {
    vi.useFakeTimers();
    const output: string[] = [];
    const c = createStreamUpdateCoalescer((v) => output.push(v), 100, 20);

    c.push('a');
    c.push('ab');
    c.push('abc');
    vi.advanceTimersByTime(25);

    expect(output).toEqual(['abc']);
    vi.useRealTimers();
  });
});
