import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  inject,
  input,
} from '@angular/core';

import { cn } from '../../utils/cn';
import {
  ArgusxButtonGroupOrientation,
  argusxButtonGroupSeparatorVariants,
  argusxButtonGroupTextAsChildVariants,
  argusxButtonGroupTextVariants,
  argusxButtonGroupVariants,
} from './button-group.variants';

@Component({
  selector: 'argusx-button-group, div[argusxButtonGroup]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  host: {
    '[attr.role]': '"group"',
    '[attr.data-slot]': '"button-group"',
    '[attr.data-orientation]': 'orientation()',
    '[class]': 'computedClass()',
  },
})
export class ArgusxButtonGroupComponent {
  readonly orientation = input<ArgusxButtonGroupOrientation>('horizontal');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      argusxButtonGroupVariants({
        orientation: this.orientation(),
      }),
      this.class()
    )
  );
}

@Component({
  selector: 'argusx-button-group-text, [argusxButtonGroupText]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  host: {
    '[attr.data-as-child]': 'asChild() ? "" : null',
    '[class]': 'computedClass()',
  },
})
export class ArgusxButtonGroupTextComponent {
  readonly asChild = input(false, { transform: booleanAttribute });
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      this.asChild() ? argusxButtonGroupTextAsChildVariants() : argusxButtonGroupTextVariants(),
      this.class()
    )
  );
}

@Component({
  selector: 'argusx-button-group-separator, [argusxButtonGroupSeparator]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  host: {
    '[attr.role]': '"none"',
    '[attr.aria-hidden]': '"true"',
    '[attr.data-slot]': '"button-group-separator"',
    '[attr.data-orientation]': 'resolvedOrientation()',
    '[attr.data-auto-orientation]': 'autoOrientation() ? "" : null',
    '[class]': 'computedClass()',
  },
})
export class ArgusxButtonGroupSeparatorComponent {
  readonly orientation = input<ArgusxButtonGroupOrientation | undefined>(undefined);
  readonly autoOrientation = input(false, { transform: booleanAttribute });
  readonly class = input<string>('');

  private readonly parentGroup = inject(ArgusxButtonGroupComponent, {
    optional: true,
    host: true,
  });

  protected readonly resolvedOrientation = computed<ArgusxButtonGroupOrientation>(() => {
    const explicitOrientation = this.orientation();
    if (explicitOrientation) {
      return explicitOrientation;
    }

    if (this.autoOrientation() && this.parentGroup) {
      return this.parentGroup.orientation() === 'vertical' ? 'horizontal' : 'vertical';
    }

    return 'vertical';
  });

  protected readonly computedClass = computed(() =>
    cn(
      argusxButtonGroupSeparatorVariants({
        orientation: this.resolvedOrientation(),
      }),
      this.class()
    )
  );
}

export const ArgusxButtonGroupComponents = [
  ArgusxButtonGroupComponent,
  ArgusxButtonGroupTextComponent,
  ArgusxButtonGroupSeparatorComponent,
] as const;
