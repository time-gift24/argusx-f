import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const DEFAULT_ASPECT_RATIO = 1;

export const argusxAspectRatioVariants = cva('relative block w-full overflow-hidden', {
  variants: {
    variant: {
      plain: '',
      subtle: 'rounded-lg border border-border bg-muted/20',
    },
  },
  defaultVariants: {
    variant: 'plain',
  },
});

type ArgusxAspectRatioVariants = VariantProps<typeof argusxAspectRatioVariants>;

export type ArgusxAspectRatioVariant = NonNullable<ArgusxAspectRatioVariants['variant']>;
export type ArgusxAspectRatioFit = 'none' | 'cover' | 'contain';

/**
 * Normalize aspect ratio input values.
 * Supports numbers (`1.777`) and string fractions (`16/9`).
 */
export function normalizeAspectRatioValue(value: number | string | null | undefined): number {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return value;
  }

  if (typeof value !== 'string') {
    return DEFAULT_ASPECT_RATIO;
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return DEFAULT_ASPECT_RATIO;
  }

  const ratioParts = trimmedValue.split('/');
  if (ratioParts.length === 2) {
    const numerator = Number(ratioParts[0]?.trim());
    const denominator = Number(ratioParts[1]?.trim());

    if (Number.isFinite(numerator) && Number.isFinite(denominator) && numerator > 0 && denominator > 0) {
      return numerator / denominator;
    }
  }

  const numericRatio = Number(trimmedValue);
  if (Number.isFinite(numericRatio) && numericRatio > 0) {
    return numericRatio;
  }

  return DEFAULT_ASPECT_RATIO;
}

@Component({
  selector: 'argusx-aspect-ratio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  host: {
    '[attr.data-slot]': '"aspect-ratio"',
    '[attr.data-variant]': 'variant()',
    '[attr.data-fit]': 'fit()',
    '[style.--argusx-aspect-ratio]': 'ratioCssValue()',
    '[class]': 'computedClass()',
  },
  styles: `
    :host {
      display: block;
      width: 100%;
      aspect-ratio: var(--argusx-aspect-ratio);
    }

    :host > :is(img, video, iframe, canvas, svg) {
      display: block;
      width: 100%;
      height: 100%;
    }

    :host[data-fit='cover'] > :is(img, video, iframe, canvas, svg) {
      object-fit: cover;
    }

    :host[data-fit='contain'] > :is(img, video, iframe, canvas, svg) {
      object-fit: contain;
    }

    :host[data-fit='none'] > :is(img, video, iframe, canvas, svg) {
      object-fit: none;
    }
  `,
})
export class ArgusxAspectRatioComponent {
  /**
   * Width / height ratio.
   * Accepts number or fraction string.
   * @default 1
   */
  readonly ratio = input<number | string>(DEFAULT_ASPECT_RATIO);

  /**
   * ArgusX extension for plain style composition.
   * @default 'plain'
   */
  readonly variant = input<ArgusxAspectRatioVariant>('plain');

  /**
   * ArgusX extension controlling media object-fit on direct children.
   * @default 'none'
   */
  readonly fit = input<ArgusxAspectRatioFit>('none');

  /**
   * Additional CSS classes applied on host.
   */
  readonly class = input<string>('');

  protected readonly normalizedRatio = computed(() => normalizeAspectRatioValue(this.ratio()));
  protected readonly ratioCssValue = computed(() => `${this.normalizedRatio()}`);
  protected readonly computedClass = computed(() =>
    cn(argusxAspectRatioVariants({ variant: this.variant() }), this.class())
  );
}
