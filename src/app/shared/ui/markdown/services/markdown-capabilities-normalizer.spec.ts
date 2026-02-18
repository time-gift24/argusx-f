import { describe, expect, it } from 'vitest';
import { normalizeCapabilities } from './markdown-capabilities-normalizer';

describe('normalizeCapabilities', () => {
  it('keeps typed capabilities and merges legacy plugin fields', () => {
    const out = normalizeCapabilities({
      capabilities: {
        controls: { table: false },
      },
      remarkPlugins: ['legacy-remark'] as any,
      rehypePlugins: ['legacy-rehype'] as any,
      allowedTags: { custom: ['className'] },
    });

    expect(out.controls?.table).toBe(false);
    expect(out.pipeline?.remarkPlugins).toEqual(['legacy-remark']);
    expect(out.pipeline?.rehypePlugins).toEqual(['legacy-rehype']);
    expect(out.pipeline?.allowedTags).toEqual({ custom: ['className'] });
  });
});
