# dropdown-menu - local 源码

## 文件
- src/app/shared/ui/dropdown-menu/dropdown-menu.component.ts

## 源码

```typescript
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
import { cva, type VariantProps } from 'class-variance-authority';
import {
  LucideAngularModule,
  CheckIcon,
  ChevronRightIcon,
} from 'lucide-angular';

// ============================================================================
// Types
// ============================================================================

export type DropdownMenuAlign = 'start' | 'center' | 'end';
export type DropdownMenuItemVariant = 'default' | 'destructive';

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
  selector: '[appDropdownMenuTrigger]',
  host: {
    '[attr.data-slot]': '"dropdown-menu-trigger"',
    '[attr.aria-expanded]': 'dropdownMenu.open()',
    '[attr.aria-haspopup]': '"menu"',
    '(click)': 'onClick()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class DropdownMenuTriggerDirective {
  readonly dropdownMenu = inject(DropdownMenuComponent);
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
  selector: 'app-dropdown-menu-group',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"dropdown-menu-group"',
    role: 'group',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenuGroupComponent {
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
  selector: 'app-dropdown-menu-label',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"dropdown-menu-label"',
    '[attr.data-inset]': 'inset() ? "" : null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenuLabelComponent {
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
// Dropdown Menu Item
// ============================================================================

const dropdownMenuItemVariants = cva(
  "focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:hover:bg-destructive/10 dark:data-[variant=destructive]:hover:bg-destructive/20 data-[variant=destructive]:hover:text-destructive data-[variant=destructive]:*:[svg]:text-destructive not-data-[variant=destructive]:focus:**:text-accent-foreground not-data-[variant=destructive]:hover:**:text-accent-foreground min-h-7 gap-2 rounded-md px-2 py-1 text-xs/relaxed data-inset:pl-7.5 [&_svg:not([class*='size-'])]:size-3.5 group/dropdown-menu-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
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
 * Dropdown Menu Item Component
 * Individual menu item
 */
@Component({
  selector: 'app-dropdown-menu-item',
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
export class DropdownMenuItemComponent {
  readonly dropdownMenu = inject(DropdownMenuComponent);

  readonly inset = input<boolean>(false);
  readonly variant = input<DropdownMenuItemVariant>('default');
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');

  readonly select = output<void>();

  protected readonly computedClass = computed(() =>
    cn(dropdownMenuItemVariants({ variant: this.variant() }), this.class())
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
  selector: 'app-dropdown-menu-checkbox-item',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <span class="absolute right-2 flex items-center justify-center pointer-events-none">
      @if (checked()) {
        <lucide-icon [img]="checkIcon" class="size-3.5" />
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
export class DropdownMenuCheckboxItemComponent {
  readonly dropdownMenu = inject(DropdownMenuComponent);

  readonly checked = input<boolean>(false);
  readonly inset = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');

  readonly checkedChange = output<boolean>();

  protected readonly checkIcon = CheckIcon;

  protected readonly computedClass = computed(() =>
    cn(
      'focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground min-h-7 gap-2 rounded-md py-1.5 pr-2 pl-2 text-xs data-inset:pl-7.5 [&_svg:not([class*=\'size-\'])]:size-3.5 relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
      'pr-8',
      'py-1',
      'hover:bg-accent hover:text-accent-foreground hover:**:text-accent-foreground',
      this.class()
    )
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
  selector: 'app-dropdown-menu-radio-group',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"dropdown-menu-radio-group"',
    role: 'group',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenuRadioGroupComponent {
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
  selector: 'app-dropdown-menu-radio-item',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <span class="absolute right-2 flex items-center justify-center pointer-events-none">
      @if (isSelected()) {
        <lucide-icon [img]="checkIcon" class="size-3.5" />
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
export class DropdownMenuRadioItemComponent {
  readonly dropdownMenu = inject(DropdownMenuComponent);
  readonly radioGroup = inject(DropdownMenuRadioGroupComponent, { optional: true });

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
      'focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground min-h-7 gap-2 rounded-md py-1.5 pr-2 pl-2 text-xs data-inset:pl-7.5 [&_svg:not([class*=\'size-\'])]:size-3.5 relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
      'pr-8',
      'py-1',
      'hover:bg-accent hover:text-accent-foreground hover:**:text-accent-foreground',
      this.class()
    )
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
  selector: 'app-dropdown-menu-separator',
  imports: [CommonModule],
  template: '',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"dropdown-menu-separator"',
    role: 'separator',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenuSeparatorComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('bg-border/50 -mx-1 my-1 h-px', this.class())
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
  selector: 'app-dropdown-menu-shortcut',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"dropdown-menu-shortcut"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenuShortcutComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground ml-auto text-[0.625rem] tracking-widest',
      'group-hover/dropdown-menu-item:text-accent-foreground',
      this.class()
    )
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
  selector: 'app-dropdown-menu-sub',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"dropdown-menu-sub"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenuSubComponent {
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
  selector: 'app-dropdown-menu-sub-trigger',
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
export class DropdownMenuSubTriggerComponent {
  readonly subMenu = inject(DropdownMenuSubComponent, { optional: true });
  readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly inset = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly chevronRightIcon = ChevronRightIcon;

  protected readonly computedClass = computed(() =>
    cn(
      'focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground min-h-7 gap-2 rounded-md px-2 py-1 text-xs data-inset:pl-7.5 [&_svg:not([class*=\'size-\'])]:size-3.5 flex cursor-default items-center outline-hidden select-none [&_svg]:pointer-events-none [&_svg]:shrink-0',
      'hover:bg-accent hover:text-accent-foreground not-data-[variant=destructive]:hover:**:text-accent-foreground',
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
// Dropdown Menu Sub Content
// ============================================================================

/**
 * Dropdown Menu Sub Content Component
 * The submenu panel - uses fixed positioning to escape overflow constraints
 */
@Component({
  selector: 'app-dropdown-menu-sub-content',
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
export class DropdownMenuSubContentComponent {
  readonly subMenu = inject(DropdownMenuSubComponent, { optional: true });
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
      'bg-popover text-popover-foreground ring-foreground/10 min-w-32 rounded-lg p-1 shadow-md ring-1 duration-100',
      'animate-in fade-in-0 zoom-in-95',
      'data-[side=right]:slide-in-from-left-2',
      'origin-top-left',
      'overflow-hidden',
      'z-50',
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
  selector: 'app-dropdown-menu',
  imports: [
    CommonModule,
    OverlayModule,
  ],
  template: `
    <div class="inline-flex">
      <!-- Trigger element -->
      <div cdkOverlayOrigin #trigger="cdkOverlayOrigin">
        <ng-content select="[appDropdownMenuTrigger]" />
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
export class DropdownMenuComponent {
  readonly open = model<boolean>(false);

  readonly align = input<DropdownMenuAlign>('start');
  readonly sideOffset = input<number>(4);
  readonly minWidth = input<number>(128);
  readonly class = input<string>('');

  // Unique ID for this dropdown instance
  readonly id = `dropdown-menu-${dropdownIdCounter++}`;
  private readonly triggerWidth = signal(0);
  protected readonly currentSide = signal<'top' | 'bottom'>('bottom');
  private readonly contentAlign = signal<DropdownMenuAlign | null>(null);
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
      'bg-popover text-popover-foreground ring-foreground/10 min-w-32 rounded-lg p-1 shadow-md ring-1 duration-100 z-50',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
      'data-[side=bottom]:slide-in-from-top-2',
      'data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2',
      'data-[side=top]:slide-in-from-bottom-2',
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
      this.runAfterOverlayRender(() => {
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

  registerContentConfig(config: {
    align?: DropdownMenuAlign;
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
  selector: 'app-dropdown-menu-content',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"dropdown-menu-content"',
    style: 'display: contents;',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenuContentComponent {
  private readonly dropdownMenu = inject(DropdownMenuComponent);

  readonly align = input<DropdownMenuAlign>('start');
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
  selector: 'app-dropdown-menu-trigger',
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
export class DropdownMenuTriggerComponent {
  readonly dropdownMenu = inject(DropdownMenuComponent);

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
  selector: 'app-dropdown-menu-portal',
  host: {
    '[attr.data-slot]': '"dropdown-menu-portal"',
  },
})
export class DropdownMenuPortalComponent {
  // Portal functionality is handled by CDK Overlay in the root component
}

// ============================================================================
// Exports
// ============================================================================

export const DropdownMenuComponents = [
  DropdownMenuComponent,
  DropdownMenuTriggerComponent,
  DropdownMenuTriggerDirective,
  DropdownMenuContentComponent,
  DropdownMenuGroupComponent,
  DropdownMenuLabelComponent,
  DropdownMenuItemComponent,
  DropdownMenuCheckboxItemComponent,
  DropdownMenuRadioGroupComponent,
  DropdownMenuRadioItemComponent,
  DropdownMenuSeparatorComponent,
  DropdownMenuShortcutComponent,
  DropdownMenuSubComponent,
  DropdownMenuSubTriggerComponent,
  DropdownMenuSubContentComponent,
  DropdownMenuPortalComponent,
];
```
