import { describe, expect, it } from 'vitest';
import { MarkdownRenderCapabilitiesService } from './markdown-render-capabilities.service';

describe('MarkdownRenderCapabilitiesService', () => {
  it('returns defaults when capability branch is missing', () => {
    const service = new MarkdownRenderCapabilitiesService();
    const ctx = service.create({});
    expect(ctx.controls.table).toBe(true);
    expect(ctx.linkSafety.enabled).toBe(false);
  });
});
