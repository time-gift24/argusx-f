import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { cn } from '../../utils/cn';

import { argusxMenuShortcutVariants } from './menu.variants';

@Component({
  selector: 'argusx-menu-shortcut, [argusxMenuShortcut], [argusx-menu-shortcut]',
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[attr.data-slot]': '"menu-shortcut"',
  },
  exportAs: 'argusxMenuShortcut',
})
export class ArgusxMenuShortcutComponent {
  readonly class = input<string>('');

  protected readonly classes = computed(() =>
    cn(argusxMenuShortcutVariants(), this.class())
  );
}
