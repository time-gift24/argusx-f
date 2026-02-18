// Unit tests for KbdDirective - testing variant classes directly
import { describe, expect, it } from 'vitest';
import { kbdSizes } from './kbd.directive';

describe('kbdSizes', () => {
  it('should have sm size with correct classes', () => {
    const classes = kbdSizes['sm'];
    expect(classes).toContain('h-4');
    expect(classes).toContain('text-[0.5rem]');
    expect(classes).toContain('min-w-4');
  });

  it('should have default size with correct classes', () => {
    const classes = kbdSizes['default'];
    expect(classes).toContain('h-5');
    expect(classes).toContain('text-[0.625rem]');
    expect(classes).toContain('min-w-5');
  });

  it('should have lg size with correct classes', () => {
    const classes = kbdSizes['lg'];
    expect(classes).toContain('h-6');
    expect(classes).toContain('text-[0.75rem]');
    expect(classes).toContain('min-w-6');
  });
});
