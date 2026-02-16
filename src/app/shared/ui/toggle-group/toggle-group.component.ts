import { computed, Component, input, signal, output, ChangeDetectionStrategy } from '@angular/core';
import { cn } from '../../utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import { ToggleDirective, toggleVariants, type ToggleVariant, type ToggleSize } from '../toggle';

// Re-export toggleVariants from toggle
export { toggleVariants } from '../toggle';
export type { ToggleVariant, ToggleSize } from '../toggle';

// ToggleGroup types
export type ToggleGroupType = 'single' | 'multiple';
export type ToggleGroupOrientation = 'horizontal' | 'vertical';

// ============================================================================
// ToggleGroup Component
// ============================================================================

const toggleGroupVariants = cva(
  'rounded-md flex w-fit flex-row items-center gap-0 data-[vertical]:flex-col data-[vertical]:items-stretch',
  {
    variants: {
      variant: {
        default: '',
        outline: '',
      },
      size: {
        default: '',
        sm: '',
        lg: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type ToggleGroupVariants = VariantProps<typeof toggleGroupVariants>;

/**
 * ToggleGroup Component
 *
 * A group of toggle buttons that work together.
 * Supports single selection (radio-like) and multiple selection (checkbox-like).
 */
@Component({
  selector: 'app-toggle-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="computedClass()"
      [attr.data-slot]="'toggle-group'"
      [attr.data-variant]="variant()"
      [attr.data-size]="size()"
      [attr.data-orientation]="orientation()"
      role="group"
    >
      <ng-content />
    </div>
  `,
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
  },
})
export class ToggleGroupComponent {
  readonly variant = input<ToggleVariant>('default');
  readonly size = input<ToggleSize>('default');
  readonly class = input<string>('');
  readonly type = input<ToggleGroupType>('single');
  readonly orientation = input<ToggleGroupOrientation>('horizontal');
  readonly spacing = input<number>(0);
  readonly value = input<string[]>([]);
  readonly valueChange = output<string[]>();

  protected readonly computedClass = computed(() =>
    cn(
      toggleGroupVariants({ variant: this.variant(), size: this.size() }),
      this.class()
    )
  );

  // For single selection mode
  protected readonly singleValue = signal<string | undefined>(undefined);

  getSingleValue(): string | undefined {
    return this.singleValue();
  }

  setSingleValue(value: string | undefined): void {
    this.singleValue.set(value);
    this.valueChange.emit(value !== undefined ? [value] : []);
  }
}

// ============================================================================
// ToggleGroupItem Directive
// ============================================================================

/**
 * ToggleGroupItem Directive
 *
 * Apply to buttons inside ToggleGroup to make them toggle items.
 */
@Component({
  selector: 'app-toggle-group-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [class]="computedClass()"
      [attr.data-slot]="'toggle-group-item'"
      [attr.data-variant]="variant()"
      [attr.data-size]="size()"
      [attr.aria-pressed]="isPressed()"
      (click)="onClick()"
    >
      <ng-content />
    </button>
  `,
  host: {
    '[class]': '"inline-flex"',
  },
})
export class ToggleGroupItemComponent {
  readonly value = input.required<string>();
  readonly group = input.required<ToggleGroupComponent>();
  readonly variant = input<ToggleVariant>('default');
  readonly size = input<ToggleSize>('default');
  readonly class = input<string>('');

  protected readonly isPressed = computed(() => {
    const group = this.group();
    if (group.type() === 'multiple') {
      return group.value().includes(this.value());
    }
    return group.getSingleValue() === this.value();
  });

  protected readonly computedClass = computed(() => {
    const group = this.group();
    const baseClass = toggleVariants({
      variant: group.variant() !== 'default' ? group.variant() : this.variant(),
      size: group.size() !== 'default' ? group.size() : this.size(),
    });

    return cn(
      'group-data-[spacing=0]/toggle-group:rounded-none shrink-0 focus:z-10 focus-visible:z-10',
      baseClass,
      this.class()
    );
  });

  protected onClick(): void {
    const group = this.group();
    const val = this.value();

    if (group.type() === 'multiple') {
      const current = [...group.value()];
      const index = current.indexOf(val);
      if (index >= 0) {
        current.splice(index, 1);
      } else {
        current.push(val);
      }
      group.valueChange.emit(current);
    } else {
      // Single selection
      const current = group.getSingleValue();
      if (current === val) {
        group.setSingleValue(undefined);
      } else {
        group.setSingleValue(val);
      }
    }
  }
}
