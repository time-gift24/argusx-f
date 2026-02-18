import { describe, expect, it } from 'vitest';
import { MarkdownCapabilitiesResolverService } from './markdown-capabilities-resolver.service';

describe('MarkdownCapabilitiesResolverService', () => {
  it('orders cjk before/after remark defaults and appends math plugins', () => {
    const service = new MarkdownCapabilitiesResolverService();
    const out = service.resolve({
      cjk: { remarkPluginsBefore: ['before'] as any, remarkPluginsAfter: ['after'] as any },
      math: { remarkPlugin: 'math-r' as any, rehypePlugin: 'math-h' as any },
    });

    expect(out.remarkPlugins).toContain('before');
    expect(out.remarkPlugins).toContain('after');
    expect(out.remarkPlugins).toContain('math-r');
    expect(out.rehypePlugins).toContain('math-h');
  });
});
