// Unit tests for ArgusxKbdDirective - testing size extension classes directly
import { describe, expect, it } from 'vitest';
import { argusxKbdSizes } from './kbd.directive';

describe('argusxKbdSizes', () => {
  it('should have sm size extension classes', () => {
    const classes = argusxKbdSizes['sm'];
    expect(classes).toContain('h-4');
    expect(classes).toContain('text-[0.625rem]');
    expect(classes).toContain('min-w-4');
  });

  it('should keep default size as shadcn baseline', () => {
    const classes = argusxKbdSizes['default'];
    expect(classes).toBe('');
  });

  it('should have lg size extension classes', () => {
    const classes = argusxKbdSizes['lg'];
    expect(classes).toContain('h-6');
    expect(classes).toContain('text-sm');
    expect(classes).toContain('min-w-6');
  });
});
