import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  model,
  OnDestroy,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkOverlayOrigin,
  OverlayModule,
  ConnectedPosition,
} from '@angular/cdk/overlay';
import { cn } from '../../utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  LucideAngularModule,
  CheckIcon,
  ChevronRightIcon,
} from 'lucide-angular';

// ============================================================================
// Types
// ============================================================================

export type MenubarAlign = 'start' | 'center' | 'end';
export type MenubarItemVariant = 'default' | 'destructive';

// ============================================================================
// Menubar Root Component
// ============================================================================

let menubarIdCounter = 0;

/**
 * Menubar Root Component
 * Horizontal menu bar for application menus
 */
@Component({
  selector: 'app-menubar',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"menubar"',
    role: 'menubar',
    '[attr.aria-label]': 'ariaLabel()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenubarComponent {
  readonly class = input<string>('');
  readonly ariaLabel = input<string>('Application menu');
  private menus: MenubarMenuComponent[] = [];

  protected readonly computedClass = computed(() =>
    cn(
      'bg-background h-9 rounded-lg border p-1 flex items-center',
      this.class()
    )
  );

  registerMenu(menu: MenubarMenuComponent): void {
    if (this.menus.includes(menu)) return;
    this.menus = [...this.menus, menu];
  }

  unregisterMenu(menu: MenubarMenuComponent): void {
    this.menus = this.menus.filter((entry) => entry !== menu);
  }

  openMenu(menu: MenubarMenuComponent): void {
    for (const entry of this.menus) {
      entry.setOpenFromRoot(entry === menu);
    }
  }

  closeMenu(menu: MenubarMenuComponent): void {
    menu.setOpenFromRoot(false);
  }

  moveFocus(menu: MenubarMenuComponent, direction: 1 | -1, openTarget = false): void {
    if (!this.menus.length) return;
    const currentIndex = this.menus.indexOf(menu);
    if (currentIndex === -1) return;

    const nextIndex =
      (currentIndex + direction + this.menus.length) % this.menus.length;
    const nextMenu = this.menus[nextIndex];
    if (!nextMenu) return;

    if (openTarget) {
      nextMenu.openMenuAndFocusFirstItem();
      return;
    }

    this.closeMenu(menu);
    nextMenu.focusTrigger();
  }
}

// ============================================================================
// Menubar Menu (individual top-level menu)
// ============================================================================

/**
 * Menubar Menu Component
 * Individual menu in the menubar with trigger and dropdown content
 */
@Component({
  selector: 'app-menubar-menu',
  imports: [CommonModule, OverlayModule],
  template: `
    <div class="inline-flex">
      <!-- Trigger element -->
      <div cdkOverlayOrigin #trigger="cdkOverlayOrigin">
        <button
          #triggerButton
          [class]="triggerClass()"
          [attr.data-slot]="'menubar-trigger'"
          [attr.aria-expanded]="open()"
          [attr.aria-haspopup]="'menu'"
          [attr.data-state]="open() ? 'open' : 'closed'"
          (click)="toggleMenu()"
          (keydown)="onTriggerKeydown($event)">
          <ng-content select="[appMenubarTrigger]" />
        </button>
      </div>

      <!-- Menu content via CDK Overlay -->
      <ng-template
        cdkConnectedOverlay
        [cdkConnectedOverlayOrigin]="trigger"
        [cdkConnectedOverlayOpen]="open()"
        [cdkConnectedOverlayPositions]="positions()"
        [cdkConnectedOverlayMinWidth]="minWidth()"
        [cdkConnectedOverlayHasBackdrop]="false"
        (overlayOutsideClick)="onOutsideClick($event)"
        (detach)="closeMenu()">
        <div
          #menuContent
          [class]="contentClass()"
          role="menu"
          [attr.data-state]="open() ? 'open' : 'closed'"
          (keydown)="onContentKeydown($event)">
          <ng-content />
        </div>
      </ng-template>
    </div>
  `,
  host: {
    '[attr.data-slot]': '"menubar-menu"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenubarMenuComponent implements OnInit, OnDestroy {
  readonly open = model<boolean>(false);
  readonly value = input<string>(''); // Unique identifier for this menu

  readonly align = input<MenubarAlign>('start');
  readonly sideOffset = input<number>(8);
  readonly alignOffset = input<number>(-4);
  readonly minWidth = input<number>(128);
  readonly class = input<string>('');

  readonly id = `menubar-menu-${menubarIdCounter++}`;
  private readonly menubar = inject(MenubarComponent, { optional: true });

  protected readonly triggerClass = computed(() =>
    cn(
      'hover:bg-muted aria-expanded:bg-muted rounded-[calc(var(--radius-md)-2px)] px-2 py-[calc(--spacing(0.85))] text-xs/relaxed font-medium flex items-center outline-hidden select-none',
      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
    )
  );

  protected readonly positions = computed<ConnectedPosition[]>(() => {
    const alignX =
      this.align() === 'start' ? 'start' : this.align() === 'end' ? 'end' : 'center';
    return [
      {
        originX: alignX,
        originY: 'bottom',
        overlayX: alignX,
        overlayY: 'top',
        offsetY: this.sideOffset(),
      },
      {
        originX: alignX,
        originY: 'top',
        overlayX: alignX,
        overlayY: 'bottom',
        offsetY: -this.sideOffset(),
      },
    ];
  });

  protected readonly contentClass = computed(() =>
    cn(
      'bg-popover text-popover-foreground ring-foreground/10 min-w-32 rounded-lg p-1 shadow-md ring-1 duration-100 z-50',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
      'data-[side=bottom]:slide-in-from-top-2',
      'data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2',
      'data-[side=top]:slide-in-from-bottom-2',
      'overflow-hidden',
      this.class()
    )
  );

  protected readonly trigger = viewChild(CdkOverlayOrigin);
  protected readonly triggerButton = viewChild<ElementRef<HTMLButtonElement>>('triggerButton');
  protected readonly menuContent = viewChild<ElementRef<HTMLElement>>('menuContent');

  ngOnInit(): void {
    this.menubar?.registerMenu(this);
  }

  ngOnDestroy(): void {
    this.menubar?.unregisterMenu(this);
  }

  openMenu(): void {
    if (this.menubar) {
      this.menubar.openMenu(this);
      return;
    }
    this.open.set(true);
  }

  openMenuAndFocusFirstItem(): void {
    this.openMenu();
    this.focusMenuItemByIndex(0);
  }

  openMenuAndFocusLastItem(): void {
    this.openMenu();
    this.focusMenuItemByIndex(-1);
  }

  closeMenu(): void {
    if (this.menubar) {
      this.menubar.closeMenu(this);
      return;
    }
    this.open.set(false);
  }

  toggleMenu(): void {
    if (this.open()) {
      this.closeMenu();
      return;
    }
    this.openMenu();
  }

  setOpenFromRoot(isOpen: boolean): void {
    this.open.set(isOpen);
  }

  focusTrigger(): void {
    this.triggerButton()?.nativeElement.focus();
  }

  protected onTriggerKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.openMenuAndFocusFirstItem();
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.openMenuAndFocusLastItem();
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openMenu();
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.menubar?.moveFocus(this, 1, this.open());
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.menubar?.moveFocus(this, -1, this.open());
    }
  }

  protected onContentKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeMenu();
      this.focusTrigger();
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.menubar?.moveFocus(this, 1, true);
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.menubar?.moveFocus(this, -1, true);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.focusAdjacentItem(1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.focusAdjacentItem(-1);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      this.focusMenuItemByIndex(0);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      this.focusMenuItemByIndex(-1);
    }
  }

  protected onOutsideClick(event: MouseEvent): void {
    const triggerEl = this.trigger()?.elementRef?.nativeElement;
    if (triggerEl && !triggerEl.contains(event.target as Node)) {
      this.closeMenu();
    }
  }

  private focusMenuItemByIndex(index: number): void {
    this.runAfterOverlayRender(() => {
      const items = this.getMenuItems();
      if (!items.length) return;
      const target =
        index < 0 ? items[items.length - 1] : items[Math.min(index, items.length - 1)];
      target?.focus();
    });
  }

  private focusAdjacentItem(direction: 1 | -1): void {
    const items = this.getMenuItems();
    if (!items.length) return;

    const activeElement =
      typeof document !== 'undefined' ? (document.activeElement as HTMLElement | null) : null;
    const currentIndex = activeElement ? items.indexOf(activeElement) : -1;
    const nextIndex =
      currentIndex < 0
        ? direction === 1
          ? 0
          : items.length - 1
        : (currentIndex + direction + items.length) % items.length;

    items[nextIndex]?.focus();
  }

  private getMenuItems(): HTMLElement[] {
    const container = this.menuContent()?.nativeElement;
    if (!container) return [];

    return Array.from(
      container.querySelectorAll<HTMLElement>(
        '[role="menuitem"],[role="menuitemcheckbox"],[role="menuitemradio"]'
      )
    ).filter((item) => item.tabIndex >= 0);
  }

  private runAfterOverlayRender(callback: () => void): void {
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => callback());
      return;
    }
    setTimeout(() => callback(), 0);
  }
}

// ============================================================================
// Menubar Trigger Content (for content projection)
// ============================================================================

/**
 * Menubar Trigger Content Component
 * Projects trigger content into the menu trigger button
 */
@Component({
  selector: '[appMenubarTrigger]',
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"menubar-trigger-content"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenubarTriggerContentComponent {}

// ============================================================================
// Menubar Group
// ============================================================================

/**
 * Menubar Group Component
 * Groups related items together
 */
@Component({
  selector: 'app-menubar-group',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"menubar-group"',
    role: 'group',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenubarGroupComponent {
  readonly class = input<string>('');
}

// ============================================================================
// Menubar Label
// ============================================================================

/**
 * Menubar Label Component
 * Labels a group of items
 */
@Component({
  selector: 'app-menubar-label',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"menubar-label"',
    '[attr.data-inset]': 'inset() ? "" : null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenubarLabelComponent {
  readonly inset = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'text-muted-foreground px-2 py-1.5 text-xs',
      this.inset() ? 'pl-7.5' : '',
      this.class()
    )
  );
}

// ============================================================================
// Menubar Item
// ============================================================================

const menubarItemVariants = cva(
  "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive! not-data-[variant=destructive]:focus:**:text-accent-foreground min-h-7 gap-2 rounded-md px-2 py-1 text-xs data-disabled:opacity-50 data-inset:pl-7.5 [&_svg:not([class*='size-'])]:size-3.5 group/menubar-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: '',
        destructive: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Menubar Item Component
 * Individual menu item
 */
@Component({
  selector: 'app-menubar-item',
  imports: [CommonModule],
  template: `
    <ng-content />
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"menubar-item"',
    '[attr.data-inset]': 'inset() ? "" : null',
    '[attr.data-variant]': 'variant()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.role]': '"menuitem"',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '(click)': 'onClick()',
    '(keydown)': 'onKeydown($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenubarItemComponent {
  readonly menubarMenu = inject(MenubarMenuComponent, { optional: true });

  readonly inset = input<boolean>(false);
  readonly variant = input<MenubarItemVariant>('default');
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');

  readonly select = output<void>();

  protected readonly computedClass = computed(() =>
    cn(menubarItemVariants({ variant: this.variant() }), this.class())
  );

  onClick(): void {
    if (this.disabled()) return;
    this.select.emit();
    // Close menu after selection
    this.menubarMenu?.closeMenu();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onClick();
    }
  }
}

// ============================================================================
// Menubar Checkbox Item
// ============================================================================

/**
 * Menubar Checkbox Item Component
 * A checkbox menu item that can be toggled
 */
@Component({
  selector: 'app-menubar-checkbox-item',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <span class="absolute left-2 size-4 flex items-center justify-center pointer-events-none">
      @if (checked()) {
        <lucide-icon [img]="checkIcon" class="size-3.5" />
      }
    </span>
    <ng-content />
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"menubar-checkbox-item"',
    '[attr.data-inset]': 'inset() ? "" : null',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.role]': '"menuitemcheckbox"',
    '[attr.aria-checked]': 'checked()',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '(click)': 'onClick()',
    '(keydown)': 'onKeydown($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenubarCheckboxItemComponent {
  readonly checked = input<boolean>(false);
  readonly inset = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');

  readonly checkedChange = output<boolean>();

  protected readonly checkIcon = CheckIcon;

  protected readonly computedClass = computed(() =>
    cn(
      'focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground min-h-7 gap-2 rounded-md py-1.5 pr-2 pl-7.5 text-xs data-inset:pl-7.5 [&_svg:not([class*=\'size-\'])]:size-3.5 relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
      this.class()
    )
  );

  onClick(): void {
    if (this.disabled()) return;
    this.checkedChange.emit(!this.checked());
    // Don't close menu for checkbox items (allows multiple selections)
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onClick();
    }
  }
}

// ============================================================================
// Menubar Radio Group
// ============================================================================

/**
 * Menubar Radio Group Component
 * Groups radio items together
 */
@Component({
  selector: 'app-menubar-radio-group',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"menubar-radio-group"',
    role: 'group',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenubarRadioGroupComponent {
  readonly value = model<string | undefined>(undefined);
  readonly class = input<string>('');
}

// ============================================================================
// Menubar Radio Item
// ============================================================================

/**
 * Menubar Radio Item Component
 * A radio menu item for single selection
 */
@Component({
  selector: 'app-menubar-radio-item',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <span class="absolute left-2 size-4 flex items-center justify-center pointer-events-none">
      @if (isSelected()) {
        <lucide-icon [img]="checkIcon" class="size-3.5" />
      }
    </span>
    <ng-content />
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"menubar-radio-item"',
    '[attr.data-inset]': 'inset() ? "" : null',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.role]': '"menuitemradio"',
    '[attr.aria-checked]': 'isSelected()',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '(click)': 'onClick()',
    '(keydown)': 'onKeydown($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenubarRadioItemComponent {
  readonly menubarMenu = inject(MenubarMenuComponent, { optional: true });
  readonly radioGroup = inject(MenubarRadioGroupComponent, { optional: true });

  readonly value = input.required<string>();
  readonly inset = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly checkIcon = CheckIcon;

  protected readonly isSelected = computed(
    () => this.radioGroup?.value() === this.value()
  );

  protected readonly computedClass = computed(() =>
    cn(
      'focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground min-h-7 gap-2 rounded-md py-1.5 pr-2 pl-7.5 text-xs data-inset:pl-7.5 [&_svg:not([class*=\'size-\'])]:size-3.5 relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
      this.class()
    )
  );

  onClick(): void {
    if (this.disabled()) return;
    if (this.radioGroup) {
      this.radioGroup.value.set(this.value());
    }
    // Close menu after selection
    this.menubarMenu?.closeMenu();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onClick();
    }
  }
}

// ============================================================================
// Menubar Separator
// ============================================================================

/**
 * Menubar Separator Component
 * Visual divider between items
 */
@Component({
  selector: 'app-menubar-separator',
  imports: [CommonModule],
  template: '',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"menubar-separator"',
    role: 'separator',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenubarSeparatorComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('bg-border/50 -mx-1 my-1 h-px', this.class())
  );
}

// ============================================================================
// Menubar Shortcut
// ============================================================================

/**
 * Menubar Shortcut Component
 * Displays keyboard shortcuts for items
 */
@Component({
  selector: 'app-menubar-shortcut',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"menubar-shortcut"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenubarShortcutComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'text-muted-foreground group-focus/menubar-item:text-accent-foreground text-[0.625rem] tracking-widest ml-auto',
      this.class()
    )
  );
}

// ============================================================================
// Menubar Sub
// ============================================================================

/**
 * Menubar Sub Component
 * Container for submenu - provides position info for fixed positioning
 */
@Component({
  selector: 'app-menubar-sub',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"menubar-sub"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenubarSubComponent {
  readonly open = model<boolean>(false);
  private readonly triggerRect = signal<DOMRect | null>(null);
  private closeTimeoutId: number | null = null;
  private readonly closeDelayMs = 120;

  readonly triggerPosition = this.triggerRect.asReadonly();

  openSubmenu(): void {
    this.clearCloseTimeout();
    this.open.set(true);
  }

  closeSubmenu(): void {
    this.clearCloseTimeout();
    this.open.set(false);
  }

  toggleSubmenu(): void {
    this.open.update((v) => !v);
  }

  updateTriggerRect(rect: DOMRect): void {
    this.triggerRect.set(rect);
  }

  onTriggerEnter(): void {
    this.openSubmenu();
  }

  onTriggerLeave(): void {
    this.scheduleCloseSubmenu();
  }

  onContentEnter(): void {
    this.clearCloseTimeout();
  }

  onContentLeave(): void {
    this.scheduleCloseSubmenu();
  }

  private scheduleCloseSubmenu(): void {
    this.clearCloseTimeout();
    this.closeTimeoutId = window.setTimeout(() => {
      this.open.set(false);
      this.closeTimeoutId = null;
    }, this.closeDelayMs);
  }

  private clearCloseTimeout(): void {
    if (this.closeTimeoutId === null) return;
    window.clearTimeout(this.closeTimeoutId);
    this.closeTimeoutId = null;
  }
}

// ============================================================================
// Menubar Sub Trigger
// ============================================================================

/**
 * Menubar Sub Trigger Component
 * Opens a submenu
 */
@Component({
  selector: 'app-menubar-sub-trigger',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <ng-content />
    <lucide-icon [img]="chevronRightIcon" class="ml-auto size-4" />
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"menubar-sub-trigger"',
    '[attr.data-inset]': 'inset() ? "" : null',
    '[attr.data-state]': 'subMenu?.open() ? "open" : "closed"',
    '[attr.role]': '"menuitem"',
    '[attr.tabindex]': '0',
    '(click)': 'onClick()',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(keydown)': 'onKeydown($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenubarSubTriggerComponent {
  readonly subMenu = inject(MenubarSubComponent, { optional: true });
  readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly inset = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly chevronRightIcon = ChevronRightIcon;

  protected readonly computedClass = computed(() =>
    cn(
      'focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground min-h-7 gap-2 rounded-md px-2 py-1 text-xs data-inset:pl-7.5 [&_svg:not([class*=\'size-\'])]:size-3.5 flex cursor-default items-center outline-none select-none',
      this.class()
    )
  );

  onClick(): void {
    this.updateTriggerPosition();
    this.subMenu?.onTriggerEnter();
  }

  onMouseEnter(): void {
    this.updateTriggerPosition();
    this.subMenu?.onTriggerEnter();
  }

  onMouseLeave(): void {
    this.subMenu?.onTriggerLeave();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.updateTriggerPosition();
      this.subMenu?.openSubmenu();
    }
  }

  private updateTriggerPosition(): void {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    this.subMenu?.updateTriggerRect(rect);
  }
}

// ============================================================================
// Menubar Sub Content
// ============================================================================

/**
 * Menubar Sub Content Component
 * The submenu panel - uses fixed positioning to escape overflow constraints
 */
@Component({
  selector: 'app-menubar-sub-content',
  imports: [CommonModule],
  template: `
    @if (subMenu?.open() && subMenu?.triggerPosition()) {
      <div
        [class]="contentClass()"
        [style.position]="'fixed'"
        [style.left.px]="positionLeft()"
        [style.top.px]="positionTop()"
        role="menu"
        data-state="open"
        (keydown)="onKeydown($event)"
        (mouseenter)="onMouseEnter()"
        (mouseleave)="onMouseLeave()">
        <ng-content />
      </div>
    }
  `,
  host: {
    '[attr.data-slot]': '"menubar-sub-content"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenubarSubContentComponent {
  readonly subMenu = inject(MenubarSubComponent, { optional: true });
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly class = input<string>('');

  protected readonly positionLeft = computed(() => {
    const rect = this.subMenu?.triggerPosition();
    if (!rect) return 0;

    const containerRect = this.getPositioningContainerRect();

    // Check if submenu would overflow viewport on right side
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const submenuWidth = 192;
    const viewportLeft =
      rect.right + 4 + submenuWidth > viewportWidth
        ? rect.left - submenuWidth - 4
        : rect.right + 4;

    return containerRect ? viewportLeft - containerRect.left : viewportLeft;
  });

  protected readonly positionTop = computed(() => {
    const rect = this.subMenu?.triggerPosition();
    if (!rect) return 0;

    const containerRect = this.getPositioningContainerRect();
    const viewportTop = rect.top - 4;

    return containerRect ? viewportTop - containerRect.top : viewportTop;
  });

  protected readonly contentClass = computed(() =>
    cn(
      'bg-popover text-popover-foreground ring-foreground/10 min-w-32 rounded-lg p-1 shadow-md ring-1 duration-100 z-50',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
      'data-[side=right]:slide-in-from-left-2',
      'origin-top-left',
      'overflow-hidden',
      this.class()
    )
  );

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' || event.key === 'ArrowLeft') {
      event.preventDefault();
      this.subMenu?.closeSubmenu();
    }
  }

  onMouseLeave(): void {
    this.subMenu?.onContentLeave();
  }

  onMouseEnter(): void {
    this.subMenu?.onContentEnter();
  }

  private getPositioningContainerRect(): DOMRect | null {
    const overlayPane = this.elementRef.nativeElement.closest('.cdk-overlay-pane');
    return overlayPane instanceof HTMLElement ? overlayPane.getBoundingClientRect() : null;
  }
}

// ============================================================================
// Menubar Portal (for API compatibility)
// ============================================================================

/**
 * Menubar Portal Component
 * In Angular CDK, portals are handled by the Overlay system
 * This component exists for API compatibility
 */
@Directive({
  selector: 'app-menubar-portal',
  host: {
    '[attr.data-slot]': '"menubar-portal"',
  },
})
export class MenubarPortalComponent {
  // Portal functionality is handled by CDK Overlay in the root component
}

// ============================================================================
// Menubar Content (for API compatibility)
// ============================================================================

/**
 * Menubar Content Component
 * Wrapper component that projects content into the menu
 * This is for API compatibility with the shadcn pattern
 */
@Component({
  selector: 'app-menubar-content',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"menubar-content"',
    style: 'display: contents;',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenubarContentComponent {
  readonly class = input<string>('');
}

// ============================================================================
// Exports
// ============================================================================

export const MenubarComponents = [
  MenubarComponent,
  MenubarMenuComponent,
  MenubarTriggerContentComponent,
  MenubarContentComponent,
  MenubarGroupComponent,
  MenubarLabelComponent,
  MenubarItemComponent,
  MenubarCheckboxItemComponent,
  MenubarRadioGroupComponent,
  MenubarRadioItemComponent,
  MenubarSeparatorComponent,
  MenubarShortcutComponent,
  MenubarSubComponent,
  MenubarSubTriggerComponent,
  MenubarSubContentComponent,
  MenubarPortalComponent,
];
