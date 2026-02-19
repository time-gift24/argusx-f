import { computed, Directive, input } from '@angular/core';
import { cn } from '../../utils/cn';

// Aligned with official shadcn typography preset
// Reference: https://ui.shadcn.com/docs/components/typography

const h1Classes = 'scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance lg:text-5xl';
const h2Classes = 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0';
const h3Classes = 'scroll-m-20 text-2xl font-semibold tracking-tight';
const h4Classes = 'scroll-m-20 text-xl font-semibold tracking-tight';
const pClasses = 'leading-7 [&:not(:first-child)]:mt-6';
const blockquoteClasses = 'mt-6 border-l-2 pl-6 italic';
const codeClasses = 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold';
const leadClasses = 'text-muted-foreground text-xl';
const largeClasses = 'text-lg font-semibold';
const smallClasses = 'text-sm leading-none font-medium';
const mutedClasses = 'text-muted-foreground text-sm';
const listClasses = 'my-6 ml-6 list-disc [&>li]:mt-2';

/**
 * Directive that applies H1 styling.
 * Use on h1 elements for page titles.
 *
 * @example
 * ```html
 * <h1 argusxTypographyH1>Page Title</h1>
 * ```
 */
@Directive({
  selector: 'h1[argusxTypographyH1]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class ArgusxTypographyH1Directive {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn(h1Classes, this.class()));
}

/**
 * Directive that applies H2 styling.
 * Use on h2 elements for section titles.
 *
 * @example
 * ```html
 * <h2 argusxTypographyH2>Section Title</h2>
 * ```
 */
@Directive({
  selector: 'h2[argusxTypographyH2]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class ArgusxTypographyH2Directive {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn(h2Classes, this.class()));
}

/**
 * Directive that applies H3 styling.
 * Use on h3 elements for subsection titles.
 *
 * @example
 * ```html
 * <h3 argusxTypographyH3>Subsection Title</h3>
 * ```
 */
@Directive({
  selector: 'h3[argusxTypographyH3]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class ArgusxTypographyH3Directive {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn(h3Classes, this.class()));
}

/**
 * Directive that applies H4 styling.
 * Use on h4 elements for minor titles.
 *
 * @example
 * ```html
 * <h4 argusxTypographyH4>Minor Title</h4>
 * ```
 */
@Directive({
  selector: 'h4[argusxTypographyH4]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class ArgusxTypographyH4Directive {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn(h4Classes, this.class()));
}

/**
 * Directive that applies paragraph styling.
 * Use on p elements for body text.
 *
 * @example
 * ```html
 * <p argusxTypographyP>Body text content goes here.</p>
 * ```
 */
@Directive({
  selector: 'p[argusxTypographyP]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class ArgusxTypographyPDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn(pClasses, this.class()));
}

/**
 * Directive that applies blockquote styling.
 * Use on blockquote elements for quoted text.
 *
 * @example
 * ```html
 * <blockquote argusxTypographyBlockquote>
 *   "This is a quoted text."
 * </blockquote>
 * ```
 */
@Directive({
  selector: 'blockquote[argusxTypographyBlockquote]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class ArgusxTypographyBlockquoteDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn(blockquoteClasses, this.class()));
}

/**
 * Directive that applies inline code styling.
 * Use on code elements for inline code snippets.
 *
 * @example
 * ```html
 * <p>Use <code argusxTypographyCode>npm install</code> to install.</p>
 * ```
 */
@Directive({
  selector: 'code[argusxTypographyCode]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class ArgusxTypographyCodeDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn(codeClasses, this.class()));
}

/**
 * Directive that applies lead paragraph styling.
 * Use on p elements for introductory text.
 *
 * @example
 * ```html
 * <p argusxTypographyLead>This is an introductory paragraph that stands out.</p>
 * ```
 */
@Directive({
  selector: 'p[argusxTypographyLead]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class ArgusxTypographyLeadDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn(leadClasses, this.class()));
}

/**
 * Directive that applies large text styling.
 * Use on any element for emphasized large text.
 *
 * @example
 * ```html
 * <div argusxTypographyLarge>Important message</div>
 * ```
 */
@Directive({
  selector: '[argusxTypographyLarge]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class ArgusxTypographyLargeDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn(largeClasses, this.class()));
}

/**
 * Directive that applies small text styling.
 * Use on small elements for smaller text.
 *
 * @example
 * ```html
 * <small argusxTypographySmall>Additional information</small>
 * ```
 */
@Directive({
  selector: 'small[argusxTypographySmall]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class ArgusxTypographySmallDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn(smallClasses, this.class()));
}

/**
 * Directive that applies muted text styling.
 * Use on any element for less prominent text.
 *
 * @example
 * ```html
 * <p argusxTypographyMuted>Secondary information</p>
 * ```
 */
@Directive({
  selector: '[argusxTypographyMuted]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class ArgusxTypographyMutedDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn(mutedClasses, this.class()));
}

/**
 * Directive that applies list styling.
 * Use on ul/ol elements for consistent list appearance.
 *
 * @example
 * ```html
 * <ul argusxTypographyList>
 *   <li>First item</li>
 *   <li>Second item</li>
 * </ul>
 * ```
 */
@Directive({
  selector: 'ul[argusxTypographyList], ol[argusxTypographyList]',
  host: {
    '[class]': 'computedClass()',
  },
})
export class ArgusxTypographyListDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn(listClasses, this.class()));
}
