import type { BooleanInput } from '@angular/cdk/coercion';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { cn } from '../../utils/cn';

import { argusxMenuLabelVariants } from './menu.variants';

@Component({
  selector: 'argusx-menu-label, [argusxMenuLabel], [argusx-menu-label]',
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[attr.data-slot]': '"menu-label"',
    '[attr.data-inset]': 'inset() ? "" : null',
  },
  exportAs: 'argusxMenuLabel',
})
export class ArgusxMenuLabelComponent {
  readonly class = input<string>('');
  readonly inset = input<boolean, BooleanInput>(false, {
    transform: booleanAttribute,
    alias: 'argusxInset',
  });

  protected readonly classes = computed(() =>
    cn(argusxMenuLabelVariants({ inset: this.inset() }), this.class())
  );
}
