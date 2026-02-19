import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  ElementRef,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkOverlayOrigin,
  ConnectedOverlayPositionChange,
  OverlayModule,
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

export type ArgusxDropdownMenuAlign = 'start' | 'center' | 'end';
export type ArgusxDropdownMenuItemVariant = 'default' | 'destructive';

// ============================================================================
// Dropdown Menu Root with integrated Overlay
// ============================================================================

let dropdownIdCounter = 0;

// ============================================================================
// Dropdown Menu Trigger
// ============================================================================

/**
 * Dropdown Menu Trigger Directive
 * Opens the dropdown when clicked
 */
@Directive({
  selector: '[argusxDropdownMenuTrigger]',
  host: {
    '[attr.data-slot]': '"dropdown-menu-trigger"',
    '[attr.aria-expanded]': 'dropdownMenu.open()',
    '[attr.aria-haspopup]': '"menu"',
    '(click)': 'onClick()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class ArgusxDropdownMenuTriggerDirective {
  readonly dropdownMenu = inject(ArgusxDropdownMenuComponent);
  readonly elementRef = inject(ElementRef<HTMLElement>);

  onClick(): void {
    this.dropdownMenu.toggleMenu();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.dropdownMenu.openMenuAndFocusFirstItem();
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.dropdownMenu.openMenuAndFocusLastItem();
    }
  }
}

// ============================================================================
// Dropdown Menu Group
// ============================================================================

/**
 * Dropdown Menu Group Component
 * Groups related items together
 */
@Component({
  selector: 'argusx-dropdown-menu-group',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"dropdown-menu-group"',
    role: 'group',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxDropdownMenuGroupComponent {
  readonly class = input<string>('');
}

// ============================================================================
// Dropdown Menu Label
// ============================================================================

/**
 * Dropdown Menu Label Component
 * Labels a group of items
 */
@Component({
  selector: 'argusx-dropdown-menu-label',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"dropdown-menu-label"',
    '[attr.data-inset]': 'inset() ? "" : null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxDropdownMenuLabelComponent {
  readonly inset = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(argusxMenuLabelVariants({ inset: this.inset() }), this.class())
  );
}

// ============================================================================
// Dropdown Menu Item
// ============================================================================

/**
 * Dropdown Menu Item Component
 * Individual menu item
 */
@Component({
  selector: 'argusx-dropdown-menu-item',
  imports: [CommonModule],
  template: `
    <ng-content />
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"dropdown-menu-item"',
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
export class ArgusxDropdownMenuItemComponent {
  readonly dropdownMenu = inject(ArgusxDropdownMenuComponent);

  readonly inset = input<boolean>(false);
  readonly variant = input<ArgusxDropdownMenuItemVariant>('default');
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
    // Close dropdown after selection
    this.dropdownMenu.closeMenu();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onClick();
    }
  }
}

// ============================================================================
// Dropdown Menu Checkbox Item
// ============================================================================

/**
 * Dropdown Menu Checkbox Item Component
 * A checkbox menu item that can be toggled
 */
@Component({
  selector: 'argusx-dropdown-menu-checkbox-item',
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
    '[attr.data-slot]': '"dropdown-menu-checkbox-item"',
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
export class ArgusxDropdownMenuCheckboxItemComponent {
  readonly dropdownMenu = inject(ArgusxDropdownMenuComponent);

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
    // Don't close dropdown for checkbox items (allows multiple selections)
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onClick();
    }
  }
}

// ============================================================================
// Dropdown Menu Radio Group
// ============================================================================

/**
 * Dropdown Menu Radio Group Component
 * Groups radio items together
 */
@Component({
  selector: 'argusx-dropdown-menu-radio-group',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"dropdown-menu-radio-group"',
    role: 'group',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxDropdownMenuRadioGroupComponent {
  readonly value = model<string | undefined>(undefined);
  readonly class = input<string>('');
}

// ============================================================================
// Dropdown Menu Radio Item
// ============================================================================

/**
 * Dropdown Menu Radio Item Component
 * A radio menu item for single selection
 */
@Component({
  selector: 'argusx-dropdown-menu-radio-item',
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
    '[attr.data-slot]': '"dropdown-menu-radio-item"',
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
export class ArgusxDropdownMenuRadioItemComponent {
  readonly dropdownMenu = inject(ArgusxDropdownMenuComponent);
  readonly radioGroup = inject(ArgusxDropdownMenuRadioGroupComponent, { optional: true });

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
    // Close dropdown after selection
    this.dropdownMenu.closeMenu();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onClick();
    }
  }
}

// ============================================================================
// Dropdown Menu Separator
// ============================================================================

/**
 * Dropdown Menu Separator Component
 * Visual divider between items
 */
@Component({
  selector: 'argusx-dropdown-menu-separator',
  imports: [CommonModule],
  template: '',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"dropdown-menu-separator"',
    role: 'separator',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxDropdownMenuSeparatorComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(argusxMenuSeparatorVariants(), this.class())
  );
}

// ============================================================================
// Dropdown Menu Shortcut
// ============================================================================

/**
 * Dropdown Menu Shortcut Component
 * Displays keyboard shortcuts for items
 */
@Component({
  selector: 'argusx-dropdown-menu-shortcut',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"dropdown-menu-shortcut"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxDropdownMenuShortcutComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(argusxMenuShortcutVariants(), this.class())
  );
}

// ============================================================================
// Dropdown Menu Sub
// ============================================================================

/**
 * Dropdown Menu Sub Component
 * Container for submenu - provides position info for fixed positioning
 */
@Component({
  selector: 'argusx-dropdown-menu-sub',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"dropdown-menu-sub"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxDropdownMenuSubComponent {
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
// Dropdown Menu Sub Trigger
// ============================================================================

/**
 * Dropdown Menu Sub Trigger Component
 * Opens a submenu
 */
@Component({
  selector: 'argusx-dropdown-menu-sub-trigger',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <ng-content />
    <lucide-icon [img]="chevronRightIcon" class="ml-auto size-3.5" />
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"dropdown-menu-sub-trigger"',
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
export class ArgusxDropdownMenuSubTriggerComponent {
  readonly subMenu = inject(ArgusxDropdownMenuSubComponent, { optional: true });
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
// Dropdown Menu Sub Content
// ============================================================================

/**
 * Dropdown Menu Sub Content Component
 * The submenu panel - uses fixed positioning to escape overflow constraints
 */
@Component({
  selector: 'argusx-dropdown-menu-sub-content',
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
    '[attr.data-slot]': '"dropdown-menu-sub-content"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxDropdownMenuSubContentComponent {
  readonly subMenu = inject(ArgusxDropdownMenuSubComponent, { optional: true });
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
      'animate-in fade-in-0 zoom-in-95',
      'origin-top-left',
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
// Dropdown Menu Root Component (with CDK Overlay)
// ============================================================================

/**
 * Dropdown Menu Root Component
 * Uses Angular CDK Overlay for positioning
 */
@Component({
  selector: 'argusx-dropdown-menu',
  imports: [
    CommonModule,
    OverlayModule,
  ],
  template: `
    <div class="inline-flex">
      <!-- Trigger element -->
      <div cdkOverlayOrigin #trigger="cdkOverlayOrigin">
        <ng-content select="[argusxDropdownMenuTrigger], argusx-dropdown-menu-trigger" />
      </div>

      <!-- Dropdown content via CDK Overlay -->
      <ng-template
        cdkConnectedOverlay
        [cdkConnectedOverlayOrigin]="trigger"
        [cdkConnectedOverlayOpen]="open()"
        [cdkConnectedOverlayPositions]="positions()"
        [cdkConnectedOverlayMinWidth]="overlayMinWidth()"
        [cdkConnectedOverlayHasBackdrop]="true"
        [cdkConnectedOverlayBackdropClass]="'cdk-overlay-transparent-backdrop'"
        (positionChange)="onPositionChange($event)"
        (overlayOutsideClick)="onOutsideClick($event)"
        (detach)="closeMenu(false)"
        (backdropClick)="closeMenu(false)">
        <div
          #menuContent
          [class]="contentClass()"
          role="menu"
          aria-orientation="vertical"
          [attr.data-state]="open() ? 'open' : 'closed'"
          [attr.data-side]="currentSide()"
          (keydown)="onContentKeydown($event)">
          <ng-content />
        </div>
      </ng-template>
    </div>
  `,
  host: {
    '[attr.data-slot]': '"dropdown-menu"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxDropdownMenuComponent {
  readonly open = model<boolean>(false);

  readonly align = input<ArgusxDropdownMenuAlign>('start');
  readonly sideOffset = input<number>(4);
  readonly minWidth = input<number>(128);
  readonly class = input<string>('');

  // Unique ID for this dropdown instance
  readonly id = `dropdown-menu-${dropdownIdCounter++}`;
  private readonly triggerWidth = signal(0);
  protected readonly currentSide = signal<'top' | 'bottom'>('bottom');
  private readonly contentAlign = signal<ArgusxDropdownMenuAlign | null>(null);
  private readonly contentSideOffset = signal<number | null>(null);
  private readonly contentClassOverride = signal('');

  protected readonly overlayMinWidth = computed(() =>
    Math.max(this.minWidth(), this.triggerWidth())
  );

  protected readonly positions = computed<ConnectedPosition[]>(() => {
    const resolvedAlign = this.contentAlign() ?? this.align();
    const resolvedSideOffset = this.contentSideOffset() ?? this.sideOffset();
    const alignX = resolvedAlign === 'start' ? 'start' : resolvedAlign === 'end' ? 'end' : 'center';
    return [
      {
        originX: alignX,
        originY: 'bottom',
        overlayX: alignX,
        overlayY: 'top',
        offsetY: resolvedSideOffset,
      },
      {
        originX: alignX,
        originY: 'top',
        overlayX: alignX,
        overlayY: 'bottom',
        offsetY: -resolvedSideOffset,
      },
    ];
  });

  protected readonly contentClass = computed(() =>
    cn(
      argusxMenuContentVariants(),
      'max-h-96',
      'max-w-[calc(100vw-1rem)]',
      'w-auto',
      'overflow-x-visible overflow-y-auto',
      'data-[state=closed]:overflow-hidden',
      this.class(),
      this.contentClassOverride()
    )
  );

  protected readonly trigger = viewChild(CdkOverlayOrigin);
  protected readonly menuContent = viewChild<ElementRef<HTMLElement>>('menuContent');

  constructor() {
    effect(() => {
      if (this.open()) {
        this.syncTriggerWidth();
      }
    });
  }

  openMenu(): void {
    this.openMenuInternal('first');
  }

  openMenuAndFocusFirstItem(): void {
    this.openMenuInternal('first');
  }

  openMenuAndFocusLastItem(): void {
    this.openMenuInternal('last');
  }

  closeMenu(restoreFocus = true): void {
    this.open.set(false);
    if (restoreFocus) {
      runAfterRender(() => {
        this.trigger()?.elementRef.nativeElement.focus();
      });
    }
  }

  toggleMenu(): void {
    const willOpen = !this.open();
    if (willOpen) {
      this.syncTriggerWidth();
      this.openMenuInternal('first');
      return;
    }
    this.closeMenu();
  }

  protected onContentKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeMenu();
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
      return;
    }

    if (event.key === 'Tab') {
      this.closeMenu(false);
    }
  }

  protected onPositionChange(event: ConnectedOverlayPositionChange): void {
    this.currentSide.set(event.connectionPair.overlayY === 'top' ? 'bottom' : 'top');
  }

  protected onOutsideClick(event: MouseEvent): void {
    const triggerEl = this.trigger()?.elementRef?.nativeElement;
    if (triggerEl && !triggerEl.contains(event.target as Node)) {
      this.closeMenu(false);
    }
  }

  private syncTriggerWidth(): void {
    const width = this.trigger()?.elementRef.nativeElement.getBoundingClientRect().width ?? 0;
    this.triggerWidth.set(Math.ceil(width));
  }

  private openMenuInternal(focus: 'first' | 'last' | 'none'): void {
    this.syncTriggerWidth();
    this.open.set(true);
    if (focus === 'first') {
      this.focusMenuItemByIndex(0);
      return;
    }
    if (focus === 'last') {
      this.focusMenuItemByIndex(-1);
    }
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

  registerContentConfig(config: {
    align?: ArgusxDropdownMenuAlign;
    sideOffset?: number;
    className?: string;
  }): void {
    this.contentAlign.set(config.align ?? null);
    this.contentSideOffset.set(config.sideOffset ?? null);
    this.contentClassOverride.set(config.className ?? '');
  }
}

// ============================================================================
// Dropdown Menu Content (for API compatibility - content projects into root)
// ============================================================================

/**
 * Dropdown Menu Content Component
 * Wrapper component that projects content into the root dropdown
 * This is for API compatibility with the shadcn pattern
 */
@Component({
  selector: 'argusx-dropdown-menu-content',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"dropdown-menu-content"',
    style: 'display: contents;',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxDropdownMenuContentComponent {
  private readonly dropdownMenu = inject(ArgusxDropdownMenuComponent);

  readonly align = input<ArgusxDropdownMenuAlign>('start');
  readonly sideOffset = input<number>(4);
  readonly class = input<string>('');

  constructor() {
    effect(() => {
      this.dropdownMenu.registerContentConfig({
        align: this.align(),
        sideOffset: this.sideOffset(),
        className: this.class(),
      });
    });
  }
}

// ============================================================================
// Dropdown Menu Trigger Component (wrapper for directive)
// ============================================================================

/**
 * Dropdown Menu Trigger Component
 * Wrapper for the trigger directive
 */
@Component({
  selector: 'argusx-dropdown-menu-trigger',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"dropdown-menu-trigger"',
    '[attr.aria-expanded]': 'dropdownMenu.open()',
    '[attr.aria-haspopup]': '"menu"',
    '(click)': 'onClick()',
    '(keydown)': 'onKeydown($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxDropdownMenuTriggerComponent {
  readonly dropdownMenu = inject(ArgusxDropdownMenuComponent);

  onClick(): void {
    this.dropdownMenu.toggleMenu();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.dropdownMenu.openMenuAndFocusFirstItem();
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.dropdownMenu.openMenuAndFocusLastItem();
    }
  }
}

// ============================================================================
// Dropdown Menu Portal (placeholder for API compatibility)
// ============================================================================

/**
 * Dropdown Menu Portal Component
 * In Angular CDK, portals are handled by the Overlay system
 * This component exists for API compatibility
 */
@Directive({
  selector: 'argusx-dropdown-menu-portal',
  host: {
    '[attr.data-slot]': '"dropdown-menu-portal"',
  },
})
export class ArgusxDropdownMenuPortalComponent {
  // Portal functionality is handled by CDK Overlay in the root component
}

// ============================================================================
// Exports
// ============================================================================

export const ArgusxDropdownMenuComponents = [
  ArgusxDropdownMenuComponent,
  ArgusxDropdownMenuTriggerComponent,
  ArgusxDropdownMenuTriggerDirective,
  ArgusxDropdownMenuContentComponent,
  ArgusxDropdownMenuGroupComponent,
  ArgusxDropdownMenuLabelComponent,
  ArgusxDropdownMenuItemComponent,
  ArgusxDropdownMenuCheckboxItemComponent,
  ArgusxDropdownMenuRadioGroupComponent,
  ArgusxDropdownMenuRadioItemComponent,
  ArgusxDropdownMenuSeparatorComponent,
  ArgusxDropdownMenuShortcutComponent,
  ArgusxDropdownMenuSubComponent,
  ArgusxDropdownMenuSubTriggerComponent,
  ArgusxDropdownMenuSubContentComponent,
  ArgusxDropdownMenuPortalComponent,
];
