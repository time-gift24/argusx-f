import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { cn } from '../../utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

// ============================================================================
// Tabs List Variants (aligned with .vendor/aim/components/ui/tabs.tsx)
// ============================================================================

const tabsListVariants = cva(
  'rounded-lg p-[3px] group-data-[orientation=horizontal]/tabs:h-9 data-[variant=line]:rounded-none group/tabs-list text-muted-foreground inline-flex w-fit items-center justify-center group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col',
  {
    variants: {
      variant: {
        default: 'bg-muted',
        line: 'gap-1 bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type TabsListVariants = VariantProps<typeof tabsListVariants>;

export type TabsListVariant = NonNullable<TabsListVariants['variant']>;

// ============================================================================
// Tabs Root Token for DI
// ============================================================================

export abstract class TabsRootToken {
  abstract value: ReturnType<typeof model<string>>;
  abstract orientation: () => 'horizontal' | 'vertical';
  abstract disabled: () => boolean;
  abstract selectTab(value: string): void;
  abstract isSelected(value: string): boolean;
  abstract getTabId(value: string): string;
  abstract getPanelId(value: string): string;
  abstract getTabElements(): HTMLElement[];
}

// ============================================================================
// Tabs Root Component
// ============================================================================

/**
 * Tabs Root Component
 *
 * A tabs component that organizes content into separate panels.
 * Supports horizontal and vertical orientations, keyboard navigation,
 * and full accessibility compliance.
 *
 * @example
 * ```html
 * <app-tabs [(value)]="selectedTab" orientation="horizontal">
 *   <app-tabs-list variant="default">
 *     <app-tabs-trigger value="tab1">Tab 1</app-tabs-trigger>
 *     <app-tabs-trigger value="tab2">Tab 2</app-tabs-trigger>
 *   </app-tabs-list>
 *   <app-tabs-content value="tab1">Content 1</app-tabs-content>
 *   <app-tabs-content value="tab2">Content 2</app-tabs-content>
 * </app-tabs>
 * ```
 *
 * Reference: .vendor/aim/components/ui/tabs.tsx
 */
@Component({
  selector: 'app-tabs',
  template: `
    <ng-content />
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"tabs"',
    '[attr.data-orientation]': 'orientation()',
  },
  providers: [
    {
      provide: TabsRootToken,
      useExisting: TabsComponent,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent extends TabsRootToken {
  private static idCounter = 0;
  private readonly hostElement = inject(ElementRef<HTMLElement>);
  private readonly rootId = `tabs-${TabsComponent.idCounter++}`;

  // ============================================================================
  // Inputs
  // ============================================================================

  /** The value of the currently selected tab */
  readonly value = model<string>('');

  /** The default value to use when the component is first rendered (shadcn-compatible) */
  readonly defaultValue = input<string>('');

  /** The orientation of the tabs */
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

  /** Whether the entire tabs component is disabled */
  readonly disabled = input<boolean>(false);

  /** Custom class for styling */
  readonly class = input<string>('');

  /** Emitted when the selected tab changes */
  readonly valueChange = output<string>();

  // ============================================================================
  // Computed Properties
  // ============================================================================

  protected readonly computedClass = computed(() =>
    cn('group/tabs flex gap-2 data-[orientation=horizontal]:flex-col', this.class())
  );

  constructor() {
    super();
    // Apply defaultValue if value is not set
    if (!this.value() && this.defaultValue()) {
      this.value.set(this.defaultValue());
    }
    afterNextRender(() => {
      this.ensureInitialTab();
    });
  }

  // ============================================================================
  // Methods
  // ============================================================================

  /**
   * Select a tab by its value
   */
  selectTab(value: string): void {
    if (this.disabled()) return;
    this.value.set(value);
    this.valueChange.emit(value);
  }

  /**
   * Check if a tab is currently selected
   */
  isSelected(value: string): boolean {
    return this.value() === value;
  }

  getTabId(value: string): string {
    return `${this.rootId}-tab-${value}`;
  }

  getPanelId(value: string): string {
    return `${this.rootId}-panel-${value}`;
  }

  getTabElements(): HTMLElement[] {
    return Array.from(
      this.hostElement.nativeElement.querySelectorAll('[role="tab"]')
    );
  }

  private ensureInitialTab(): void {
    if (this.value()) return;

    const firstEnabledTab = this.getTabElements().find(
      (tab) => !tab.hasAttribute('disabled')
    );
    const firstValue = firstEnabledTab?.getAttribute('data-value');
    if (firstValue) {
      this.value.set(firstValue);
    }
  }
}

// ============================================================================
// Tabs List Component
// ============================================================================

/**
 * Tabs List Component
 *
 * Container for tab triggers. Provides visual grouping and styling variants.
 *
 * @example
 * ```html
 * <app-tabs-list variant="default">
 *   <app-tabs-trigger value="tab1">Tab 1</app-tabs-trigger>
 * </app-tabs-list>
 * ```
 */
@Component({
  selector: 'app-tabs-list',
  template: `
    <ng-content />
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"tabs-list"',
    '[attr.data-variant]': 'variant()',
    '[attr.role]': '"tablist"',
    '[attr.aria-orientation]': 'root?.orientation()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsListComponent {
  readonly root = inject(TabsRootToken, { optional: true });

  /** The visual variant of the tabs list */
  readonly variant = input<TabsListVariant>('default');

  /** Custom class for styling */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(tabsListVariants({ variant: this.variant() }), this.class())
  );
}

// ============================================================================
// Tabs Trigger Component
// ============================================================================

/**
 * Tabs Trigger Component
 *
 * Individual tab button that triggers content panel switching.
 * Supports keyboard navigation and full accessibility.
 *
 * @example
 * ```html
 * <app-tabs-trigger value="tab1" [disabled]="false">
 *   Tab Label
 * </app-tabs-trigger>
 * ```
 */
@Component({
  selector: 'app-tabs-trigger',
  template: `
    <ng-content />
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"tabs-trigger"',
    '[attr.data-state]': 'isActive() ? "active" : "inactive"',
    '[attr.data-value]': 'value()',
    '[attr.role]': '"tab"',
    '[attr.tabindex]': 'tabIndex()',
    '[attr.aria-selected]': 'isActive()',
    '[attr.aria-controls]': 'panelId()',
    '[attr.id]': 'tabId()',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[attr.disabled]': 'isDisabled() ? "" : null',
    '(click)': 'onClick()',
    '(keydown)': 'onKeydown($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsTriggerComponent {
  readonly root = inject(TabsRootToken, { optional: true });

  /** The value that this tab represents */
  readonly value = input.required<string>();

  /** Whether this specific tab is disabled */
  readonly disabled = input<boolean>(false);

  /** Custom class for styling */
  readonly class = input<string>('');

  // ============================================================================
  // Computed Properties
  // ============================================================================

  protected readonly isActive = computed(() => {
    if (!this.root) return false;
    return this.root.isSelected(this.value());
  });

  protected readonly isDisabled = computed(() => {
    if (this.disabled()) return true;
    return this.root?.disabled() ?? false;
  });

  protected readonly tabIndex = computed(() => {
    // Only the active tab or first tab should be focusable
    if (this.isDisabled()) return -1;
    return this.isActive() ? 0 : -1;
  });

  protected readonly tabId = computed(() => {
    if (!this.root) {
      return `tab-${this.value()}`;
    }
    return this.root.getTabId(this.value());
  });

  protected readonly panelId = computed(() => {
    if (!this.root) {
      return `panel-${this.value()}`;
    }
    return this.root.getPanelId(this.value());
  });

  protected readonly computedClass = computed(() =>
    cn(
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-foreground/60 hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-all group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
      'group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent',
      'data-[state=active]:bg-background dark:data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 data-[state=active]:text-foreground',
      'after:bg-foreground after:absolute after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100',
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring',
      this.class()
    )
  );

  // ============================================================================
  // Methods
  // ============================================================================

  protected onClick(): void {
    if (this.isDisabled() || !this.root) return;
    this.root.selectTab(this.value());
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.isDisabled() || !this.root) return;

    const orientation = this.root.orientation();
    let direction: 'next' | 'prev' | null = null;

    if (orientation === 'horizontal') {
      if (event.key === 'ArrowRight') direction = 'next';
      else if (event.key === 'ArrowLeft') direction = 'prev';
    } else {
      if (event.key === 'ArrowDown') direction = 'next';
      else if (event.key === 'ArrowUp') direction = 'prev';
    }

    if (direction) {
      event.preventDefault();
      this.navigateTabs(direction);
    }

    // Home and End keys
    if (event.key === 'Home') {
      event.preventDefault();
      this.focusFirstTab();
    } else if (event.key === 'End') {
      event.preventDefault();
      this.focusLastTab();
    }
  }

  private navigateTabs(direction: 'next' | 'prev'): void {
    if (!this.root) return;
    const tabTriggers = this.root.getTabElements();
    const currentIndex = tabTriggers.findIndex(
      (tab) => tab.id === this.tabId()
    );

    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % tabTriggers.length;
    } else {
      nextIndex =
        (currentIndex - 1 + tabTriggers.length) % tabTriggers.length;
    }

    // Focus and activate the next tab
    const nextTab = tabTriggers[nextIndex];
    nextTab?.focus();
    nextTab?.click();
  }

  private focusFirstTab(): void {
    if (!this.root) return;
    const tabTriggers = this.root.getTabElements();
    const firstTab = tabTriggers[0];
    firstTab?.focus();
    firstTab?.click();
  }

  private focusLastTab(): void {
    if (!this.root) return;
    const tabTriggers = this.root.getTabElements();
    const lastTab = tabTriggers[tabTriggers.length - 1];
    lastTab?.focus();
    lastTab?.click();
  }
}

// ============================================================================
// Tabs Content Component
// ============================================================================

/**
 * Tabs Content Component
 *
 * Content panel that displays when its associated tab is selected.
 *
 * @example
 * ```html
 * <app-tabs-content value="tab1">
 *   <p>Tab content goes here</p>
 * </app-tabs-content>
 * ```
 */
@Component({
  selector: 'app-tabs-content',
  template: `
    @if (isActive()) {
      <ng-content />
    }
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"tabs-content"',
    '[attr.role]': '"tabpanel"',
    '[attr.id]': 'panelId()',
    '[attr.aria-labelledby]': 'tabId()',
    '[attr.tabindex]': '0',
    '[attr.hidden]': 'isActive() ? null : ""',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsContentComponent {
  readonly root = inject(TabsRootToken, { optional: true });

  /** The value of the tab this content is associated with */
  readonly value = input.required<string>();

  /** Custom class for styling */
  readonly class = input<string>('');

  // ============================================================================
  // Computed Properties
  // ============================================================================

  protected readonly isActive = computed(() => {
    if (!this.root) return false;
    return this.root.isSelected(this.value());
  });

  protected readonly panelId = computed(() => {
    if (!this.root) {
      return `panel-${this.value()}`;
    }
    return this.root.getPanelId(this.value());
  });

  protected readonly tabId = computed(() => {
    if (!this.root) {
      return `tab-${this.value()}`;
    }
    return this.root.getTabId(this.value());
  });

  protected readonly computedClass = computed(() =>
    cn('text-xs/relaxed flex-1 outline-none', this.class())
  );

}

// ============================================================================
// Exports
// ============================================================================

export const TabsComponents = [
  TabsComponent,
  TabsListComponent,
  TabsTriggerComponent,
  TabsContentComponent,
];
