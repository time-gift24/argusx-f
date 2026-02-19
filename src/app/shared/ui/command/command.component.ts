import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '../../utils/cn';
import { LucideAngularModule, SearchIcon, CheckIcon } from 'lucide-angular';

// ============================================================================
// Types
// ============================================================================

export interface CommandItemData<T = unknown> {
  value: T;
  label: string;
  disabled?: boolean;
  shortcut?: string;
}

// ============================================================================
// Command Root Token for DI
// ============================================================================

export abstract class CommandRootToken<T = unknown> {
  abstract value: ReturnType<typeof model<T | undefined>>;
  abstract searchTerm: ReturnType<typeof signal<string>>;
  abstract disabled: () => boolean;
  abstract filterFn: () => ((item: CommandItemData<T>, search: string) => boolean) | undefined;
  abstract hasVisibleItems: () => boolean;
  abstract selectValue: (value: T) => void;
  abstract isSelected: (value: T) => boolean;
  abstract registerItem: (isVisible: () => boolean) => number;
  abstract unregisterItem: (id: number) => void;
}

export abstract class CommandGroupToken {
  abstract hasVisibleItems: () => boolean;
  abstract registerItem: (isVisible: () => boolean) => number;
  abstract unregisterItem: (id: number) => void;
}

// ============================================================================
// Command Component
// ============================================================================

/**
 * Command Component
 * Main container for command palette functionality.
 * Aligned with shadcn/ui API
 *
 * API:
 * - selector: argusx-command
 * - data-slot: command
 */
@Component({
  selector: 'argusx-command',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"command"',
  },
  providers: [
    {
      provide: CommandRootToken,
      useExisting: forwardRef(() => ArgusxCommandComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxCommandComponent<T = unknown> implements CommandRootToken<T> {
  readonly class = input<string>('');
  readonly value = model<T | undefined>(undefined);
  readonly disabled = input<boolean>(false);
  readonly filterFn = input<(item: CommandItemData<T>, search: string) => boolean>();

  readonly valueChange = output<T | undefined>();

  readonly searchTerm = signal<string>('');

  private readonly itemVisibilityMap = signal(new Map<number, () => boolean>());
  private nextItemId = 0;

  readonly hasVisibleItems = computed(() => {
    for (const isVisible of this.itemVisibilityMap().values()) {
      if (isVisible()) {
        return true;
      }
    }

    return false;
  });

  protected readonly computedClass = computed(() =>
    cn(
      'bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md',
      this.class()
    )
  );

  selectValue(itemValue: T): void {
    this.value.set(itemValue);
    this.valueChange.emit(itemValue);
  }

  isSelected(itemValue: T): boolean {
    return this.value() === itemValue;
  }

  registerItem(isVisible: () => boolean): number {
    const id = this.nextItemId++;
    this.itemVisibilityMap.update((current) => {
      const next = new Map(current);
      next.set(id, isVisible);
      return next;
    });
    return id;
  }

  unregisterItem(id: number): void {
    this.itemVisibilityMap.update((current) => {
      const next = new Map(current);
      next.delete(id);
      return next;
    });
  }
}

// ============================================================================
// Command Input Component
// ============================================================================

/**
 * Command Input Component
 * Search input for filtering command items.
 * Aligned with shadcn/ui API
 *
 * API:
 * - selector: argusx-command-input
 * - data-slot: command-input (on input element)
 * - data-slot: command-input-wrapper (on wrapper div)
 */
@Component({
  selector: 'argusx-command-input',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div data-slot="command-input-wrapper" class="flex h-9 items-center gap-2 border-b px-3">
      <lucide-icon [img]="searchIcon" class="shrink-0 opacity-50 size-4" />
      <input
        [class]="inputClass()"
        [type]="'text'"
        [placeholder]="placeholder()"
        [disabled]="command.disabled()"
        [value]="command.searchTerm()"
        data-slot="command-input"
        (input)="onInput($event)"
      />
    </div>
  `,
  host: {
    '[class]': 'class()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxCommandInputComponent {
  readonly command = inject<CommandRootToken>(CommandRootToken);

  readonly placeholder = input<string>('Type a command or search...');
  readonly class = input<string>('');

  protected readonly searchIcon = SearchIcon;

  protected readonly inputClass = computed(() =>
    cn(
      'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
      this.class()
    )
  );

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.command.searchTerm.set(target.value);
  }
}

// ============================================================================
// Command List Component
// ============================================================================

/**
 * Command List Component
 * Scrollable container for command items.
 * Aligned with shadcn/ui API
 *
 * API:
 * - selector: argusx-command-list
 * - data-slot: command-list
 */
@Component({
  selector: 'argusx-command-list',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"command-list"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxCommandListComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto', this.class())
  );
}

// ============================================================================
// Command Empty Component
// ============================================================================

/**
 * Command Empty Component
 * Shows when no results match the search term.
 * Aligned with shadcn/ui API
 *
 * API:
 * - selector: argusx-command-empty
 * - data-slot: command-empty
 */
@Component({
  selector: 'argusx-command-empty',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"command-empty"',
    '[attr.hidden]': 'command.hasVisibleItems() ? "" : null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxCommandEmptyComponent {
  private readonly command = inject<CommandRootToken>(CommandRootToken);

  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('py-6 text-center text-sm text-muted-foreground', this.class())
  );
}

// ============================================================================
// Command Group Component
// ============================================================================

/**
 * Command Group Component
 * Groups related command items with an optional heading.
 * Aligned with shadcn/ui API
 *
 * API:
 * - selector: argusx-command-group
 * - data-slot: command-group
 */
@Component({
  selector: 'argusx-command-group',
  imports: [CommonModule],
  template: `
    @if (heading()) {
      <div
        class="text-muted-foreground px-2 py-1.5 text-xs font-medium"
        data-slot="command-group-heading"
      >
        {{ heading() }}
      </div>
    }
    <ng-content />
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"command-group"',
    '[attr.hidden]': 'hasVisibleItems() ? null : ""',
    role: 'group',
  },
  providers: [
    {
      provide: CommandGroupToken,
      useExisting: forwardRef(() => ArgusxCommandGroupComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxCommandGroupComponent implements CommandGroupToken {
  readonly heading = input<string>('');
  readonly class = input<string>('');

  private readonly itemVisibilityMap = signal(new Map<number, () => boolean>());
  private nextItemId = 0;

  readonly hasVisibleItems = computed(() => {
    for (const isVisible of this.itemVisibilityMap().values()) {
      if (isVisible()) {
        return true;
      }
    }

    return false;
  });

  protected readonly computedClass = computed(() =>
    cn('text-foreground overflow-hidden p-1', this.class())
  );

  registerItem(isVisible: () => boolean): number {
    const id = this.nextItemId++;
    this.itemVisibilityMap.update((current) => {
      const next = new Map(current);
      next.set(id, isVisible);
      return next;
    });
    return id;
  }

  unregisterItem(id: number): void {
    this.itemVisibilityMap.update((current) => {
      const next = new Map(current);
      next.delete(id);
      return next;
    });
  }
}

// ============================================================================
// Command Separator Component
// ============================================================================

/**
 * Command Separator Component
 * Visual divider between groups.
 * Aligned with shadcn/ui API
 *
 * API:
 * - selector: argusx-command-separator
 * - data-slot: command-separator
 */
@Component({
  selector: 'argusx-command-separator',
  imports: [CommonModule],
  template: '',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"command-separator"',
    role: 'separator',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxCommandSeparatorComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn('bg-border -mx-1 h-px', this.class()));
}

// ============================================================================
// Command Item Component
// ============================================================================

/**
 * Command Item Component
 * Selectable item in the command palette.
 * Aligned with shadcn/ui API
 *
 * API:
 * - selector: argusx-command-item
 * - data-slot: command-item
 * - data-selected: true/false
 * - data-disabled: true/false
 */
@Component({
  selector: 'argusx-command-item',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <ng-content />
    @if (shortcut()) {
      <span
        data-slot="command-shortcut"
        class="text-muted-foreground group-data-selected/command-item:text-foreground ml-auto text-xs tracking-widest"
      >
        {{ shortcut() }}
      </span>
    } @else {
      <lucide-icon
        [img]="checkIcon"
        class="ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100 size-3.5"
      />
    }
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"command-item"',
    '[attr.data-value]': 'stringValue()',
    '[attr.data-disabled]': 'disabled() ? "true" : null',
    '[attr.data-checked]': 'isSelected() ? "true" : "false"',
    '[attr.data-selected]': 'isSelected() ? "true" : null',
    '[attr.aria-selected]': 'isSelected()',
    '[attr.aria-disabled]': 'disabled()',
    '[attr.hidden]': 'isVisible() ? null : ""',
    role: 'option',
    '(click)': 'onClick()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxCommandItemComponent<T = unknown> {
  private readonly command = inject<CommandRootToken<T>>(CommandRootToken);
  private readonly group = inject<CommandGroupToken | null>(CommandGroupToken, {
    optional: true,
  });
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  readonly value = input.required<T>();
  readonly shortcut = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly checkIcon = CheckIcon;

  protected readonly stringValue = computed(() => String(this.value()));

  protected readonly isSelected = computed(() => this.command.isSelected(this.value()));

  protected readonly isVisible = computed(() => {
    const search = this.command.searchTerm().trim().toLowerCase();
    if (!search) {
      return true;
    }

    const label = this.getNormalizedLabel();
    const item: CommandItemData<T> = {
      value: this.value(),
      label,
      disabled: this.disabled(),
      shortcut: this.shortcut() || undefined,
    };

    const filterFn = this.command.filterFn();
    if (filterFn) {
      return filterFn(item, search);
    }

    return label.includes(search) || this.stringValue().toLowerCase().includes(search);
  });

  protected readonly computedClass = computed(() =>
    cn(
      'data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
      '[&_svg:not([class*="size-"])]:size-4',
      'group/command-item',
      'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
      '[&_svg]:pointer-events-none [&_svg]:shrink-0',
      this.disabled() ? 'pointer-events-none opacity-50' : 'cursor-pointer',
      this.class()
    )
  );

  constructor() {
    const rootItemId = this.command.registerItem(() => this.isVisible());
    this.destroyRef.onDestroy(() => this.command.unregisterItem(rootItemId));

    if (this.group) {
      const groupItemId = this.group.registerItem(() => this.isVisible());
      this.destroyRef.onDestroy(() => this.group?.unregisterItem(groupItemId));
    }
  }

  onClick(): void {
    if (this.disabled()) {
      return;
    }

    this.command.selectValue(this.value());
  }

  private getNormalizedLabel(): string {
    return (this.elementRef.nativeElement.textContent ?? '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }
}

// ============================================================================
// Command Shortcut Component
// ============================================================================

/**
 * Command Shortcut Component
 * Displays keyboard shortcut for a command.
 * Aligned with shadcn/ui API
 *
 * API:
 * - selector: argusx-command-shortcut
 * - data-slot: command-shortcut
 */
@Component({
  selector: 'argusx-command-shortcut',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"command-shortcut"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxCommandShortcutComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'text-muted-foreground group-data-selected/command-item:text-foreground ml-auto text-xs tracking-widest',
      this.class()
    )
  );
}

// ============================================================================
// Exports
// ============================================================================

export const ArgusxCommandComponents = [
  ArgusxCommandComponent,
  ArgusxCommandInputComponent,
  ArgusxCommandListComponent,
  ArgusxCommandEmptyComponent,
  ArgusxCommandGroupComponent,
  ArgusxCommandItemComponent,
  ArgusxCommandShortcutComponent,
  ArgusxCommandSeparatorComponent,
];
