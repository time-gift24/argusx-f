import { CdkTrapFocus } from '@angular/cdk/a11y';
import { CdkMenu } from '@angular/cdk/menu';
import { computed, Directive, inject, input, type OnInit } from '@angular/core';

import { cn } from '../../utils/cn';

import { argusxMenuContentVariants } from './menu.variants';

@Directive({
  selector: '[argusxMenuContent], [argusx-menu-content]',
  host: {
    '[class]': 'classes()',
    '[attr.data-slot]': '"menu-content"',
    tabindex: '0',
  },
  hostDirectives: [CdkMenu, CdkTrapFocus],
  exportAs: 'argusxMenuContent',
})
export class ArgusxMenuContentDirective implements OnInit {
  private readonly trapFocus = inject(CdkTrapFocus);

  readonly class = input<string>('');

  protected readonly classes = computed(() =>
    cn(argusxMenuContentVariants(), this.class())
  );

  ngOnInit(): void {
    this.trapFocus.enabled = true;
    this.trapFocus.autoCapture = true;
  }
}
