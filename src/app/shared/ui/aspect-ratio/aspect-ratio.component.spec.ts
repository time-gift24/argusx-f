import { describe, expect, it } from 'vitest';
import { argusxAspectRatioVariants, normalizeAspectRatioValue } from './aspect-ratio.component';

describe('normalizeAspectRatioValue', () => {
  it('returns positive numeric ratios as-is', () => {
    expect(normalizeAspectRatioValue(16 / 9)).toBeCloseTo(16 / 9, 6);
  });

  it('parses string fractions', () => {
    expect(normalizeAspectRatioValue('4 / 3')).toBeCloseTo(4 / 3, 6);
  });

  it('falls back to square for invalid ratios', () => {
    expect(normalizeAspectRatioValue('0')).toBe(1);
    expect(normalizeAspectRatioValue('-2')).toBe(1);
    expect(normalizeAspectRatioValue('invalid')).toBe(1);
  });
});

describe('argusxAspectRatioVariants', () => {
  it('uses plain as the default variant', () => {
    expect(argusxAspectRatioVariants()).not.toContain('rounded-lg');
  });

  it('applies subtle variant styles when requested', () => {
    const classes = argusxAspectRatioVariants({ variant: 'subtle' });
    expect(classes).toContain('rounded-lg');
    expect(classes).toContain('border');
  });
});
