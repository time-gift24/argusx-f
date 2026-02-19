import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  ElementRef,
  effect,
  Input,
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
  ConnectedOverlayPositionChange,
  ConnectedPosition,
} from '@angular/cdk/overlay';
import { cn } from '../../utils/cn';
import {
  focusAdjacentMenuItem,
  focusMenuItemByIndex,
  getMenuFocusableItems,
  runAfterRender,
} from '../menu-core/focus';
import {
  argusxMenuCheckboxItemVariants,
  argusxMenuContentVariants,
  argusxMenuItemVariants,
  argusxMenuLabelVariants,
  argusxMenuRadioItemVariants,
  argusxMenuSeparatorVariants,
  argusxMenuShortcutVariants,
  argusxMenuSubContentVariants,
  argusxMenuSubTriggerVariants,
} from '../menu-core/menu.variants';
import {
  LucideAngularModule,
  CheckIcon,
  CircleIcon,
  ChevronRightIcon,
} from 'lucide-angular';

// ============================================================================
// Types
// ============================================================================

export type ArgusxMenubarAlign = 'start' | 'center' | 'end';
export type ArgusxMenubarItemVariant = 'default' | 'destructive';

// ============================================================================
// ArgusxMenubar Root Component
// ============================================================================

let menubarIdCounter = 0;

/**
 * ArgusxMenubar Root Component
 * Horizontal menu bar for application menus
 */
@Component({
  selector: 'argusx-menubar',
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
export class ArgusxMenubarComponent {
  readonly class = input<string>('');
  readonly ariaLabel = input<string>('Application menu');
  private menus: ArgusxMenubarMenuComponent[] = [];

  protected readonly computedClass = computed(() =>
    cn(
      'bg-background h-9 rounded-lg border p-1 flex items-center',
      this.class()
    )
  );

  registerMenu(menu: ArgusxMenubarMenuComponent): void {
    if (this.menus.includes(menu)) return;
    this.menus = [...this.menus, menu];
  }

  unregisterMenu(menu: ArgusxMenubarMenuComponent): void {
    this.menus = this.menus.filter((entry) => entry !== menu);
  }

  openMenu(menu: ArgusxMenubarMenuComponent): void {
    for (const entry of this.menus) {
      entry.setOpenFromRoot(entry === menu);
    }
  }

  closeMenu(menu: ArgusxMenubarMenuComponent): void {
    menu.setOpenFromRoot(false);
  }

  hasOpenMenu(exclude?: ArgusxMenubarMenuComponent): boolean {
    return this.menus.some((entry) => entry !== exclude && entry.open());
  }

  moveFocus(menu: ArgusxMenubarMenuComponent, direction: 1 | -1, openTarget = false): void {
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
// ArgusxMenubar Menu (individual top-level menu)
// ============================================================================

/**
 * ArgusxMenubar Menu Component
 * Individual menu in the menubar with trigger and dropdown content
 */
@Component({
  selector: 'argusx-menubar-menu',
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
          (mouseenter)="onTriggerMouseEnter()"
          (keydown)="onTriggerKeydown($event)">
          <ng-content select="[argusxMenubarTrigger], argusx-menubar-trigger" />
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
        (positionChange)="onPositionChange($event)"
        (overlayOutsideClick)="onOutsideClick($event)"
        (detach)="closeMenu()">
        <div
          #menuContent
          [class]="contentClass()"
          role="menu"
          [attr.data-state]="open() ? 'open' : 'closed'"
          [attr.data-side]="currentSide()"
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
export class ArgusxMenubarMenuComponent implements OnInit, OnDestroy {
  readonly open = model<boolean>(false);
  readonly value = input<string>(''); // Unique identifier for this menu

  readonly align = input<ArgusxMenubarAlign>('start');
  readonly sideOffset = input<number>(8);
  readonly alignOffset = input<number>(-4);
  readonly minWidth = input<number>(128);
  readonly class = input<string>('');

  readonly id = `menubar-menu-${menubarIdCounter++}`;
  private readonly menubar = inject(ArgusxMenubarComponent, { optional: true });
  protected readonly currentSide = signal<'top' | 'bottom'>('bottom');
  private readonly contentAlign = signal<ArgusxMenubarAlign | null>(null);
  private readonly contentAlignOffset = signal<number | null>(null);
  private readonly contentSideOffset = signal<number | null>(null);
  private readonly contentClassOverride = signal('');
  private readonly resolvedAlign = computed(
    () => this.contentAlign() ?? this.align()
  );
  private readonly resolvedAlignOffset = computed(
    () => this.contentAlignOffset() ?? this.alignOffset()
  );
  private readonly resolvedSideOffset = computed(
    () => this.contentSideOffset() ?? this.sideOffset()
  );

  protected readonly triggerClass = computed(() =>
    cn(
      'hover:bg-muted aria-expanded:bg-muted rounded-[calc(var(--radius-md)-2px)] px-2 py-[calc(--spacing(0.85))] text-xs/relaxed font-medium flex items-center outline-hidden select-none',
      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
    )
  );

  protected readonly positions = computed<ConnectedPosition[]>(() => {
    const resolvedAlign = this.resolvedAlign();
    const resolvedAlignOffset = this.resolvedAlignOffset();
    const resolvedSideOffset = this.resolvedSideOffset();
    const alignX =
      resolvedAlign === 'start' ? 'start' : resolvedAlign === 'end' ? 'end' : 'center';
    return [
      {
        originX: alignX,
        originY: 'bottom',
        overlayX: alignX,
        overlayY: 'top',
        offsetX: resolvedAlignOffset,
        offsetY: resolvedSideOffset,
      },
      {
        originX: alignX,
        originY: 'top',
        overlayX: alignX,
        overlayY: 'bottom',
        offsetX: resolvedAlignOffset,
        offsetY: -resolvedSideOffset,
      },
    ];
  });

  protected readonly contentClass = computed(() =>
    cn(
      argusxMenuContentVariants(),
      'min-w-[12rem]',
      'overflow-hidden',
      this.class(),
      this.contentClassOverride()
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

  protected onTriggerMouseEnter(): void {
    if (!this.menubar?.hasOpenMenu(this) || this.open()) {
      return;
    }
    this.openMenu();
  }

  protected onContentKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeMenu();
      this.focusTrigger();
      return;
    }

    if (event.key === 'ArrowRight') {
      if (this.shouldSkipTopLevelArrowNavigation(event)) {
        return;
      }
      event.preventDefault();
      this.menubar?.moveFocus(this, 1, true);
      return;
    }

    if (event.key === 'ArrowLeft') {
      if (this.shouldSkipTopLevelArrowNavigation(event)) {
        return;
      }
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

  protected onPositionChange(event: ConnectedOverlayPositionChange): void {
    this.currentSide.set(event.connectionPair.overlayY === 'top' ? 'bottom' : 'top');
  }

  private focusMenuItemByIndex(index: number): void {
    runAfterRender(() => {
      focusMenuItemByIndex(
        getMenuFocusableItems(this.menuContent()?.nativeElement),
        index
      );
    });
  }

  private focusAdjacentItem(direction: 1 | -1): void {
    const activeElement =
      typeof document !== 'undefined' ? document.activeElement : null;
    focusAdjacentMenuItem(
      getMenuFocusableItems(this.menuContent()?.nativeElement),
      direction,
      activeElement
    );
  }

  private shouldSkipTopLevelArrowNavigation(event: KeyboardEvent): boolean {
    const target = event.target;
    if (!(target instanceof Element)) {
      return false;
    }

    return !!target.closest(
      '[data-slot="menubar-sub-trigger"], [data-slot="menubar-sub-content"]'
    );
  }

  registerContentConfig(config: {
    align?: ArgusxMenubarAlign;
    alignOffset?: number;
    sideOffset?: number;
    className?: string;
  }): void {
    this.contentAlign.set(config.align ?? null);
    this.contentAlignOffset.set(config.alignOffset ?? null);
    this.contentSideOffset.set(config.sideOffset ?? null);
    this.contentClassOverride.set(config.className ?? '');
  }
}

// ============================================================================
// ArgusxMenubar Trigger Content (for content projection)
// ============================================================================

/**
 * ArgusxMenubar Trigger Content Component
 * Projects trigger content into the menu trigger button
 */
@Component({
  selector: '[argusxMenubarTrigger], argusx-menubar-trigger',
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"menubar-trigger-content"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxMenubarTriggerContentComponent {}

// ============================================================================
// ArgusxMenubar Group
// ============================================================================

/**
 * ArgusxMenubar Group Component
 * Groups related items together
 */
@Component({
  selector: 'argusx-menubar-group',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"menubar-group"',
    role: 'group',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxMenubarGroupComponent {
  readonly class = input<string>('');
}

// ============================================================================
// ArgusxMenubar Label
// ============================================================================

/**
 * ArgusxMenubar Label Component
 * Labels a group of items
 */
@Component({
  selector: 'argusx-menubar-label',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"menubar-label"',
    '[attr.data-inset]': 'inset() ? "" : null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxMenubarLabelComponent {
  readonly inset = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(argusxMenuLabelVariants({ inset: this.inset() }), this.class())
  );
}

// ============================================================================
// ArgusxMenubar Item
// ============================================================================

/**
 * ArgusxMenubar Item Component
 * Individual menu item
 */
@Component({
  selector: 'argusx-menubar-item',
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
export class ArgusxMenubarItemComponent {
  readonly menubarMenu = inject(ArgusxMenubarMenuComponent, { optional: true });

  readonly inset = input<boolean>(false);
  readonly variant = input<ArgusxMenubarItemVariant>('default');
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');

  readonly select = output<void>();

  protected readonly computedClass = computed(() =>
    cn(
      argusxMenuItemVariants({
        inset: this.inset(),
        variant: this.variant(),
      }),
      this.class()
    )
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
// ArgusxMenubar Checkbox Item
// ============================================================================

/**
 * ArgusxMenubar Checkbox Item Component
 * A checkbox menu item that can be toggled
 */
@Component({
  selector: 'argusx-menubar-checkbox-item',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <span
      class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
      @if (checked()) {
        <lucide-icon [img]="checkIcon" class="size-4" />
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
export class ArgusxMenubarCheckboxItemComponent {
  readonly checked = input<boolean>(false);
  readonly inset = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');

  readonly checkedChange = output<boolean>();

  protected readonly checkIcon = CheckIcon;

  protected readonly computedClass = computed(() =>
    cn(argusxMenuCheckboxItemVariants(), this.class())
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
// ArgusxMenubar Radio Group
// ============================================================================

/**
 * ArgusxMenubar Radio Group Component
 * Groups radio items together
 */
@Component({
  selector: 'argusx-menubar-radio-group',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"menubar-radio-group"',
    role: 'group',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxMenubarRadioGroupComponent {
  readonly value = model<string | undefined>(undefined);
  readonly class = input<string>('');
}

// ============================================================================
// ArgusxMenubar Radio Item
// ============================================================================

/**
 * ArgusxMenubar Radio Item Component
 * A radio menu item for single selection
 */
@Component({
  selector: 'argusx-menubar-radio-item',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <span
      class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
      @if (isSelected()) {
        <lucide-icon [img]="circleIcon" class="size-2 fill-current" />
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
export class ArgusxMenubarRadioItemComponent {
  readonly menubarMenu = inject(ArgusxMenubarMenuComponent, { optional: true });
  readonly radioGroup = inject(ArgusxMenubarRadioGroupComponent, { optional: true });

  readonly value = input<string>('');
  readonly inset = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly circleIcon = CircleIcon;

  protected readonly isSelected = computed(
    () => this.radioGroup?.value() === this.value()
  );

  protected readonly computedClass = computed(() =>
    cn(argusxMenuRadioItemVariants(), this.class())
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
// ArgusxMenubar Separator
// ============================================================================

/**
 * ArgusxMenubar Separator Component
 * Visual divider between items
 */
@Component({
  selector: 'argusx-menubar-separator',
  imports: [CommonModule],
  template: '',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"menubar-separator"',
    role: 'separator',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxMenubarSeparatorComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(argusxMenuSeparatorVariants(), this.class())
  );
}

// ============================================================================
// ArgusxMenubar Shortcut
// ============================================================================

/**
 * ArgusxMenubar Shortcut Component
 * Displays keyboard shortcuts for items
 */
@Component({
  selector: 'argusx-menubar-shortcut',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"menubar-shortcut"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxMenubarShortcutComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(argusxMenuShortcutVariants(), this.class())
  );
}

// ============================================================================
// ArgusxMenubar Sub
// ============================================================================

/**
 * ArgusxMenubar Sub Component
 * Container for submenu - provides position info for fixed positioning
 */
@Component({
  selector: 'argusx-menubar-sub',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"menubar-sub"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxMenubarSubComponent {
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
// ArgusxMenubar Sub Trigger
// ============================================================================

/**
 * ArgusxMenubar Sub Trigger Component
 * Opens a submenu
 */
@Component({
  selector: 'argusx-menubar-sub-trigger',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <ng-content />
    <lucide-icon [img]="chevronRightIcon" class="ml-auto size-3.5" />
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
export class ArgusxMenubarSubTriggerComponent {
  readonly subMenu = inject(ArgusxMenubarSubComponent, { optional: true });
  readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly inset = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly chevronRightIcon = ChevronRightIcon;

  protected readonly computedClass = computed(() =>
    cn(argusxMenuSubTriggerVariants({ inset: this.inset() }), this.class())
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
      event.stopPropagation();
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
// ArgusxMenubar Sub Content
// ============================================================================

/**
 * ArgusxMenubar Sub Content Component
 * The submenu panel - uses fixed positioning to escape overflow constraints
 */
@Component({
  selector: 'argusx-menubar-sub-content',
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
export class ArgusxMenubarSubContentComponent {
  readonly subMenu = inject(ArgusxMenubarSubComponent, { optional: true });
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
      argusxMenuSubContentVariants(),
      'origin-top-left',
      this.class()
    )
  );

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' || event.key === 'ArrowLeft') {
      event.preventDefault();
      event.stopPropagation();
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
// ArgusxMenubar Portal (for API compatibility)
// ============================================================================

/**
 * ArgusxMenubar Portal Component
 * In Angular CDK, portals are handled by the Overlay system
 * This component exists for API compatibility
 */
@Directive({
  selector: 'argusx-menubar-portal',
  host: {
    '[attr.data-slot]': '"menubar-portal"',
  },
})
export class ArgusxMenubarPortalComponent {
  // Portal functionality is handled by CDK Overlay in the root component
}

// ============================================================================
// ArgusxMenubar Content (for API compatibility)
// ============================================================================

/**
 * ArgusxMenubar Content Component
 * Wrapper component that projects content into the menu
 * This is for API compatibility with the shadcn pattern
 */
@Component({
  selector: 'argusx-menubar-content',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"menubar-content"',
    style: 'display: contents;',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxMenubarContentComponent {
  private readonly menubarMenu = inject(ArgusxMenubarMenuComponent);
  private readonly contentAlign = signal<ArgusxMenubarAlign>('start');
  private readonly contentAlignOffset = signal(-4);
  private readonly contentSideOffset = signal(8);
  private readonly contentClassName = signal('');

  @Input() set align(value: ArgusxMenubarAlign | null | undefined) {
    this.contentAlign.set(value ?? 'start');
  }

  @Input({ alias: 'alignOffset' }) set alignOffset(value: number | string | null | undefined) {
    this.contentAlignOffset.set(Number(value ?? -4));
  }

  @Input({ alias: 'sideOffset' }) set sideOffset(value: number | string | null | undefined) {
    this.contentSideOffset.set(Number(value ?? 8));
  }

  @Input({ alias: 'class' }) set className(value: string | null | undefined) {
    this.contentClassName.set(value ?? '');
  }

  constructor() {
    effect(() => {
      this.menubarMenu.registerContentConfig({
        align: this.contentAlign(),
        alignOffset: this.contentAlignOffset(),
        sideOffset: this.contentSideOffset(),
        className: this.contentClassName(),
      });
    });
  }
}

// ============================================================================
// Exports
// ============================================================================

export const ArgusxMenubarComponents = [
  ArgusxMenubarComponent,
  ArgusxMenubarMenuComponent,
  ArgusxMenubarTriggerContentComponent,
  ArgusxMenubarContentComponent,
  ArgusxMenubarGroupComponent,
  ArgusxMenubarLabelComponent,
  ArgusxMenubarItemComponent,
  ArgusxMenubarCheckboxItemComponent,
  ArgusxMenubarRadioGroupComponent,
  ArgusxMenubarRadioItemComponent,
  ArgusxMenubarSeparatorComponent,
  ArgusxMenubarShortcutComponent,
  ArgusxMenubarSubComponent,
  ArgusxMenubarSubTriggerComponent,
  ArgusxMenubarSubContentComponent,
  ArgusxMenubarPortalComponent,
];
