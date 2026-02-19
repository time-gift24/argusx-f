import type { BooleanInput } from '@angular/cdk/coercion';
import { CdkMenuItem } from '@angular/cdk/menu';
import {
  booleanAttribute,
  computed,
  Directive,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';

import { cn } from '../../utils/cn';

import {
  argusxMenuItemVariants,
  type ArgusxMenuItemVariant,
} from './menu.variants';

@Directive({
  selector: 'button[argusxMenuItem], [argusxMenuItem], button[argusx-menu-item], [argusx-menu-item]',
  host: {
    '[class]': 'classes()',
    '[attr.data-orientation]': "'horizontal'",
    '[attr.data-state]': 'openState()',
    '[attr.aria-disabled]': 'disabledState() ? "" : undefined',
    '[attr.data-disabled]': 'disabledState() ? "" : undefined',
    '[attr.data-highlighted]': 'highlightedState() ? "" : undefined',
    '[attr.data-slot]': '"menu-item"',
    '[attr.data-variant]': 'variant()',
    '[attr.data-inset]': 'inset() ? "" : undefined',
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
    '(pointermove)': 'onPointerMove($event)',
    '(click)': 'onClick($event)',
    '(keydown.enter)': 'onClick($event)',
    '(keydown.space)': 'onClick($event)',
  },
  hostDirectives: [
    {
      directive: CdkMenuItem,
      outputs: ['cdkMenuItemTriggered: menuItemTriggered'],
    },
  ],
  exportAs: 'argusxMenuItem',
})
export class ArgusxMenuItemDirective {
  private readonly cdkMenuItem = inject(CdkMenuItem, { host: true });

  readonly disabled = input<boolean, BooleanInput>(false, {
    transform: booleanAttribute,
    alias: 'argusxDisabled',
  });
  readonly inset = input<boolean, BooleanInput>(false, {
    transform: booleanAttribute,
    alias: 'argusxInset',
  });
  readonly variant = input<ArgusxMenuItemVariant>('default', {
    alias: 'argusxVariant',
  });
  readonly class = input<string>('');

  private readonly focused = signal(false);

  protected readonly disabledState = computed(() => this.disabled());
  protected readonly openState = computed(() =>
    this.cdkMenuItem.isMenuOpen() ? 'open' : 'closed'
  );
  protected readonly highlightedState = computed(() => this.focused());

  protected readonly classes = computed(() =>
    cn(
      argusxMenuItemVariants({
        inset: this.inset(),
        variant: this.variant(),
      }),
      this.class()
    )
  );

  constructor() {
    effect(() => {
      const isDisabled = this.disabled();
      untracked(() => {
        this.cdkMenuItem.disabled = isDisabled;
      });
    });
  }

  onFocus(): void {
    if (!this.disabled()) {
      this.focused.set(true);
    }
  }

  onBlur(): void {
    this.focused.set(false);
  }

  onPointerMove(event: PointerEvent): void {
    if (event.defaultPrevented || event.pointerType !== 'mouse') {
      return;
    }

    if (!this.disabled()) {
      (event.currentTarget as HTMLElement | null)?.focus({ preventScroll: true });
    }
  }

  onClick(event: Event): void {
    if (!this.disabledState()) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  }
}
