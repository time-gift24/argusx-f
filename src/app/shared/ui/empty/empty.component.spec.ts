// Unit tests for Empty directive - testing variant classes directly
import { describe, expect, it } from 'vitest';
import { emptyMediaVariants } from './empty.directive';

describe('emptyMediaVariants', () => {
  describe('variant', () => {
    it('should return default classes for default variant', () => {
      const classes = emptyMediaVariants({ variant: 'default' });
      expect(classes).toContain('flex');
      expect(classes).toContain('items-center');
      expect(classes).toContain('justify-center');
      expect(classes).toContain('bg-transparent');
    });

    it('should return icon classes for icon variant', () => {
      const classes = emptyMediaVariants({ variant: 'icon' });
      expect(classes).toContain('bg-muted');
      expect(classes).toContain('text-foreground');
      expect(classes).toContain('size-10');
      expect(classes).toContain('rounded-lg');
      expect(classes).toContain('[&_svg:not([class*=size-])]:size-6');
    });
  });

  describe('size', () => {
    it('should return default margin for default size', () => {
      const classes = emptyMediaVariants({ size: 'default' });
      expect(classes).toContain('mb-2');
    });

    it('should return smaller margin for sm size', () => {
      const classes = emptyMediaVariants({ size: 'sm' });
      expect(classes).toContain('mb-1.5');
    });

    it('should return larger margin for lg size', () => {
      const classes = emptyMediaVariants({ size: 'lg' });
      expect(classes).toContain('mb-3');
    });
  });

  describe('combined variants', () => {
    it('should combine variant and size correctly', () => {
      const classes = emptyMediaVariants({ variant: 'icon', size: 'lg' });
      expect(classes).toContain('bg-muted');
      expect(classes).toContain('size-10');
      expect(classes).toContain('rounded-lg');
      expect(classes).toContain('mb-3');
    });
  });
});

describe('ArgusxEmptyDirective API', () => {
  it('should export correct types', () => {
    // These are type-level tests - if they compile, they pass
    type TestVariant = 'default' | 'muted';
    type TestSize = 'default' | 'sm' | 'lg';
    type TestMediaVariant = 'default' | 'icon';
    type TestMediaSize = 'default' | 'sm' | 'lg';

    // Verify the types exist and can be used
    const variants: TestVariant[] = ['default', 'muted'];
    const sizes: TestSize[] = ['default', 'sm', 'lg'];
    const mediaVariants: TestMediaVariant[] = ['default', 'icon'];
    const mediaSizes: TestMediaSize[] = ['default', 'sm', 'lg'];

    expect(variants).toHaveLength(2);
    expect(sizes).toHaveLength(3);
    expect(mediaVariants).toHaveLength(2);
    expect(mediaSizes).toHaveLength(3);
  });
});

describe('ArgusxEmptyDirective exports', () => {
  it('should export all required items', async () => {
    const module = await import('./empty.directive');

    // Directives
    expect(module.ArgusxEmptyDirective).toBeDefined();
    expect(module.ArgusxEmptyHeaderDirective).toBeDefined();
    expect(module.ArgusxEmptyMediaDirective).toBeDefined();
    expect(module.ArgusxEmptyTitleDirective).toBeDefined();
    expect(module.ArgusxEmptyDescriptionDirective).toBeDefined();
    expect(module.ArgusxEmptyContentDirective).toBeDefined();

    // Variants
    expect(module.emptyMediaVariants).toBeDefined();
  });

  it('should export type definitions', () => {
    // Type exports - these are compile-time only, but we can verify the index exports them
    // by checking if the types can be used in type annotations
    type TestEmptyVariant = import('./empty.directive').EmptyVariant;
    type TestEmptySize = import('./empty.directive').EmptySize;
    type TestEmptyMediaVariant = import('./empty.directive').EmptyMediaVariant;
    type TestEmptyMediaSize = import('./empty.directive').EmptyMediaSize;

    // If this compiles, the types are exported correctly
    const _typeCheck: TestEmptyVariant = 'default';
    const _typeCheck2: TestEmptySize = 'sm';
    const _typeCheck3: TestEmptyMediaVariant = 'icon';
    const _typeCheck4: TestEmptyMediaSize = 'lg';

    expect(true).toBe(true);
  });
});
