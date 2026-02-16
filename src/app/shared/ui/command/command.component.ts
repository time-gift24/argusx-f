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
 * Aligned with official shadcn preset (.vendor/aim/components/ui/command.tsx)
 *
 * Official comparison URL:
 * https://ui.shadcn.com/create?base=radix&style=mira&baseColor=neutral&theme=cyan&iconLibrary=lucide&font=nunito-sans&menuAccent=bold&menuColor=default&radius=medium&template=vite&rtl=false&item=command-example
 */
@Component({
  selector: 'app-command',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"command"',
  },
  providers: [
    {
      provide: CommandRootToken,
      useExisting: forwardRef(() => CommandComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandComponent<T = unknown> implements CommandRootToken<T> {
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
      'bg-popover text-popover-foreground rounded-xl p-1 flex size-full flex-col overflow-hidden',
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
 */
@Component({
  selector: 'app-command-input',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div data-slot="command-input-wrapper" class="p-1 pb-0">
      <div
        class="bg-input/20 dark:bg-input/30 h-8 flex items-center gap-3 rounded-md border border-input transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30"
      >
        <lucide-icon [img]="searchIcon" class="text-muted-foreground size-3.5 ml-2 shrink-0 opacity-50" />
        <input
          [class]="inputClass()"
          [type]="'text'"
          [placeholder]="placeholder()"
          [disabled]="command.disabled()"
          [value]="command.searchTerm()"
          [attr.data-slot]="'command-input'"
          (input)="onInput($event)"
        />
      </div>
    </div>
  `,
  host: {
    '[class]': 'class()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandInputComponent {
  readonly command = inject<CommandRootToken>(CommandRootToken);

  readonly placeholder = input<string>('Type a command or search...');
  readonly class = input<string>('');

  protected readonly searchIcon = SearchIcon;

  protected readonly inputClass = computed(() =>
    cn(
      'w-full text-xs/relaxed outline-hidden disabled:cursor-not-allowed disabled:opacity-50 bg-transparent border-0 pr-2 py-0.5',
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
 */
@Component({
  selector: 'app-command-list',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"command-list"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandListComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('no-scrollbar max-h-72 scroll-py-1 outline-none overflow-x-hidden overflow-y-auto', this.class())
  );
}

// ============================================================================
// Command Empty Component
// ============================================================================

/**
 * Command Empty Component
 * Shows when no results match the search term.
 */
@Component({
  selector: 'app-command-empty',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"command-empty"',
    '[attr.hidden]': 'command.hasVisibleItems() ? "" : null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandEmptyComponent {
  private readonly command = inject<CommandRootToken>(CommandRootToken);

  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn('py-6 text-center text-xs/relaxed', this.class()));
}

// ============================================================================
// Command Group Component
// ============================================================================

/**
 * Command Group Component
 * Groups related command items with an optional heading.
 */
@Component({
  selector: 'app-command-group',
  imports: [CommonModule],
  template: `
    @if (heading()) {
      <div
        class="text-muted-foreground px-2.5 py-1.5 text-xs font-medium"
        [attr.cmdk-group-heading]="true"
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
      useExisting: forwardRef(() => CommandGroupComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandGroupComponent implements CommandGroupToken {
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

  protected readonly computedClass = computed(() => cn('text-foreground overflow-hidden p-1', this.class()));

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
 */
@Component({
  selector: 'app-command-separator',
  imports: [CommonModule],
  template: '',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"command-separator"',
    role: 'separator',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandSeparatorComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn('bg-border/50 -mx-1 my-1 h-px', this.class()));
}

// ============================================================================
// Command Item Component
// ============================================================================

/**
 * Command Item Component
 * Selectable item in the command palette.
 */
@Component({
  selector: 'app-command-item',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <ng-content />
    @if (shortcut()) {
      <span
        data-slot="command-shortcut"
        class="text-muted-foreground group-data-selected/command-item:text-foreground ml-auto text-[0.625rem] tracking-widest"
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
    '[attr.data-selected]': 'isSelected() ? "" : null',
    '[attr.aria-selected]': 'isSelected()',
    '[attr.aria-disabled]': 'disabled()',
    '[attr.hidden]': 'isVisible() ? null : ""',
    role: 'option',
    '(click)': 'onClick()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandItemComponent<T = unknown> {
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
      'data-selected:bg-muted data-selected:text-foreground data-selected:*:[svg]:text-foreground',
      'relative flex min-h-7 cursor-default items-center gap-2 rounded-md px-2.5 py-1.5 text-xs/relaxed outline-hidden select-none',
      'in-data-[slot=dialog-content]:rounded-md',
      "[&_svg:not([class*='size-'])]:size-3.5",
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
 */
@Component({
  selector: 'app-command-shortcut',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"command-shortcut"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandShortcutComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'text-muted-foreground group-data-selected/command-item:text-foreground ml-auto text-[0.625rem] tracking-widest',
      this.class()
    )
  );
}

// ============================================================================
// Exports
// ============================================================================

export const CommandComponents = [
  CommandComponent,
  CommandInputComponent,
  CommandListComponent,
  CommandEmptyComponent,
  CommandGroupComponent,
  CommandItemComponent,
  CommandShortcutComponent,
  CommandSeparatorComponent,
];
