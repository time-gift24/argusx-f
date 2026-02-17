import { describe, expect, it } from 'vitest';
import {
  getDefaultRemarkPlugins,
  getDefaultRehypePlugins,
} from './default-markdown-plugins';

describe('default markdown plugin references', () => {
  it('returns stable references when allowedTags is undefined', () => {
    expect(getDefaultRemarkPlugins()).toBe(getDefaultRemarkPlugins());
    expect(getDefaultRehypePlugins(undefined)).toBe(
      getDefaultRehypePlugins(undefined)
    );
  });
});
