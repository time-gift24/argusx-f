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
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  OverlayModule,
  ConnectedPosition,
  Overlay,
  OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal, PortalModule } from '@angular/cdk/portal';
import { cn } from '../../utils/cn';
import { cva } from 'class-variance-authority';
import {
  LucideAngularModule,
  CheckIcon,
  CircleIcon,
  SquareIcon,
  ChevronRightIcon,
} from 'lucide-angular';

// ============================================================================
// Types
// ============================================================================

export type ContextMenuItemVariant = 'default' | 'destructive';
export type ContextMenuSide = 'top' | 'right' | 'bottom' | 'left';

// ============================================================================
// Context Menu Root with integrated Overlay
// ============================================================================

let contextMenuIdCounter = 0;

// ============================================================================
// Context Menu Trigger
// ============================================================================

/**
 * Context Menu Trigger Directive
 * Opens the context menu on right-click
 */
@Directive({
  selector: '[appContextMenuTrigger]',
  host: {
    '[attr.data-slot]': '"context-menu-trigger"',
    '[attr.aria-expanded]': 'contextMenu.open()',
    '[attr.aria-haspopup]': '"menu"',
    '(contextmenu)': 'onContextMenu($event)',
    '(keydown)': 'onKeydown($event)',
  },
})
export class ContextMenuTriggerDirective {
  readonly contextMenu = inject(ContextMenuComponent);
  readonly elementRef = inject(ElementRef<HTMLElement>);

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.contextMenu.openAt(
      event.clientX,
      event.clientY,
      this.elementRef.nativeElement
    );
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
      event.preventDefault();
      event.stopPropagation();
      this.contextMenu.openFromTriggerElement(this.elementRef.nativeElement);
    }
  }
}

/**
 * Context Menu Trigger Component
 * Wrapper for trigger behavior (compatible with shadcn API)
 */
@Component({
  selector: 'app-context-menu-trigger',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"context-menu-trigger"',
    '[attr.aria-expanded]': 'contextMenu.open()',
    '[attr.aria-haspopup]': '"menu"',
    '(contextmenu)': 'onContextMenu($event)',
    '(keydown)': 'onKeydown($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuTriggerComponent {
  readonly contextMenu = inject(ContextMenuComponent);
  readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('select-none', this.class())
  );

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.contextMenu.openAt(
      event.clientX,
      event.clientY,
      this.elementRef.nativeElement
    );
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
      event.preventDefault();
      event.stopPropagation();
      this.contextMenu.openFromTriggerElement(this.elementRef.nativeElement);
    }
  }
}

// ============================================================================
// Context Menu Group
// ============================================================================

/**
 * Context Menu Group Component
 * Groups related items together
 */
@Component({
  selector: 'app-context-menu-group',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"context-menu-group"',
    role: 'group',
    style: 'display: contents;',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuGroupComponent {
  readonly class = input<string>('');
}

// ============================================================================
// Context Menu Label
// ============================================================================

/**
 * Context Menu Label Component
 * Labels a group of items
 */
@Component({
  selector: 'app-context-menu-label',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"context-menu-label"',
    '[attr.data-inset]': 'inset() ? "" : null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuLabelComponent {
  readonly inset = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'text-foreground px-2 py-1.5 text-xs leading-4 font-medium',
      this.inset() ? 'pl-8' : '',
      this.class()
    )
  );
}

// ============================================================================
// Context Menu Item
// ============================================================================

const contextMenuItemVariants = cva(
  "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:[&_svg]:!text-destructive data-[variant=default]:[&_svg:not([class*='text-'])]:text-muted-foreground group/context-menu-item relative flex cursor-default items-center gap-2 rounded-md px-2 py-1 text-xs leading-[19.5px] outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
 * Context Menu Item Component
 * Individual menu item
 */
@Component({
  selector: 'app-context-menu-item',
  imports: [CommonModule],
  template: `
    <ng-content />
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"context-menu-item"',
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
export class ContextMenuItemComponent {
  readonly contextMenu = inject(ContextMenuComponent);

  readonly inset = input<boolean>(false);
  readonly variant = input<ContextMenuItemVariant>('default');
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');

  readonly select = output<void>();

  protected readonly computedClass = computed(() =>
    cn(
      contextMenuItemVariants({ variant: this.variant() }),
      'hover:bg-accent hover:text-accent-foreground hover:**:text-accent-foreground',
      this.class()
    )
  );

  onClick(): void {
    if (this.disabled()) return;
    this.select.emit();
    // Close menu after selection
    this.contextMenu.closeMenu();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onClick();
    }
  }
}

// ============================================================================
// Context Menu Checkbox Item
// ============================================================================

/**
 * Context Menu Checkbox Item Component
 * A checkbox menu item that can be toggled
 */
@Component({
  selector: 'app-context-menu-checkbox-item',
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
    '[attr.data-slot]': '"context-menu-checkbox-item"',
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
export class ContextMenuCheckboxItemComponent {
  readonly checked = input<boolean>(false);
  readonly inset = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');

  readonly checkedChange = output<boolean>();

  protected readonly checkIcon = CheckIcon;

  protected readonly computedClass = computed(() =>
    cn(
      "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-md py-1 pr-2 pl-8 text-xs leading-[19.5px] outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      'hover:bg-accent hover:text-accent-foreground hover:**:text-accent-foreground',
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
// Context Menu Radio Group
// ============================================================================

/**
 * Context Menu Radio Group Component
 * Groups radio items together
 */
@Component({
  selector: 'app-context-menu-radio-group',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"context-menu-radio-group"',
    role: 'group',
    style: 'display: contents;',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuRadioGroupComponent {
  readonly value = model<string | undefined>(undefined);
  readonly class = input<string>('');
}

// ============================================================================
// Context Menu Radio Item
// ============================================================================

/**
 * Context Menu Radio Item Component
 * A radio menu item for single selection
 */
@Component({
  selector: 'app-context-menu-radio-item',
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
    '[attr.data-slot]': '"context-menu-radio-item"',
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
export class ContextMenuRadioItemComponent {
  readonly contextMenu = inject(ContextMenuComponent);
  readonly radioGroup = inject(ContextMenuRadioGroupComponent, { optional: true });

  readonly value = input.required<string>();
  readonly inset = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly circleIcon = CircleIcon;

  protected readonly isSelected = computed(
    () => this.radioGroup?.value() === this.value()
  );

  protected readonly computedClass = computed(() =>
    cn(
      "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-md py-1 pr-2 pl-8 text-xs leading-[19.5px] outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      'hover:bg-accent hover:text-accent-foreground hover:**:text-accent-foreground',
      this.class()
    )
  );

  onClick(): void {
    if (this.disabled()) return;
    if (this.radioGroup) {
      this.radioGroup.value.set(this.value());
    }
    // Close menu after selection
    this.contextMenu.closeMenu();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onClick();
    }
  }
}

// ============================================================================
// Context Menu Separator
// ============================================================================

/**
 * Context Menu Separator Component
 * Visual divider between items
 */
@Component({
  selector: 'app-context-menu-separator',
  imports: [CommonModule],
  template: '',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"context-menu-separator"',
    role: 'separator',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuSeparatorComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('bg-border -mx-1 my-1 h-px block', this.class())
  );
}

// ============================================================================
// Context Menu Shortcut
// ============================================================================

/**
 * Context Menu Shortcut Component
 * Displays keyboard shortcuts for items
 */
@Component({
  selector: 'app-context-menu-shortcut',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"context-menu-shortcut"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuShortcutComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'text-muted-foreground ml-auto text-[10px] leading-[16.25px] tracking-[1px]',
      'group-focus/context-menu-item:text-accent-foreground group-hover/context-menu-item:text-accent-foreground',
      this.class()
    )
  );
}

// ============================================================================
// Context Menu Sub
// ============================================================================

/**
 * Context Menu Sub Component
 * Container for submenu - provides position info for fixed positioning
 */
@Component({
  selector: 'app-context-menu-sub',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"context-menu-sub"',
    style: 'display: contents;',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuSubComponent {
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
// Context Menu Sub Trigger
// ============================================================================

/**
 * Context Menu Sub Trigger Component
 * Opens a submenu
 */
@Component({
  selector: 'app-context-menu-sub-trigger',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <ng-content />
    <lucide-icon [img]="subTriggerIcon" class="ml-auto size-4" />
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"context-menu-sub-trigger"',
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
export class ContextMenuSubTriggerComponent {
  readonly subMenu = inject(ContextMenuSubComponent, { optional: true });
  readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly inset = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly subTriggerIcon = ChevronRightIcon;

  protected readonly computedClass = computed(() =>
    cn(
      "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex min-h-7 cursor-default items-center rounded-md px-2 py-1 text-xs leading-4 outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      'hover:bg-accent hover:text-accent-foreground hover:**:text-accent-foreground',
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
// Context Menu Sub Content
// ============================================================================

/**
 * Context Menu Sub Content Component
 * The submenu panel - uses fixed positioning to escape overflow constraints
 */
@Component({
  selector: 'app-context-menu-sub-content',
  imports: [CommonModule],
  template: `
    @if (subMenu?.open() && subMenu?.triggerPosition()) {
      <div
        [class]="contentClass()"
        [style.position]="'fixed'"
        [style.left.px]="positionLeft()"
        [style.top.px]="positionTop()"
        [attr.data-slot]="'context-menu-sub-content'"
        role="menu"
        data-state="open"
        [attr.data-side]="computedSide()"
        (keydown)="onKeydown($event)"
        (mouseenter)="onMouseEnter()"
        (mouseleave)="onMouseLeave()">
        <ng-content />
      </div>
    }
  `,
  host: {
    '[attr.data-slot]': '"context-menu-sub-content"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuSubContentComponent {
  readonly subMenu = inject(ContextMenuSubComponent, { optional: true });
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

  protected readonly computedSide = computed<ContextMenuSide>(() => {
    const rect = this.subMenu?.triggerPosition();
    if (!rect || typeof window === 'undefined') {
      return 'right';
    }

    const submenuWidth = 192;
    return rect.right + 4 + submenuWidth > window.innerWidth ? 'left' : 'right';
  });

  protected readonly contentClass = computed(() =>
    cn(
      'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-[var(--radix-context-menu-content-transform-origin)] overflow-hidden rounded-[10px] border p-1 shadow-lg',
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
// Context Menu Root Component (with CDK Overlay)
// ============================================================================

/**
 * Context Menu Root Component
 * Uses Angular CDK Overlay for positioning at mouse coordinates
 */
@Component({
  selector: 'app-context-menu',
  imports: [
    CommonModule,
    OverlayModule,
    PortalModule,
  ],
  template: `
    <!-- Trigger element (projected content) -->
    <ng-content select="[appContextMenuTrigger], app-context-menu-trigger" />

    <!-- Menu content via CDK Overlay -->
    <ng-template #menuPortal>
      <div
        #menuContent
        [class]="contentClass()"
        [attr.data-slot]="'context-menu-content'"
        role="menu"
        tabindex="-1"
        [attr.data-state]="open() ? 'open' : 'closed'"
        [attr.data-side]="renderedSide()"
        (keydown)="onContentKeydown($event)"
        (click)="$event.stopPropagation()">
        <ng-content />
      </div>
    </ng-template>
  `,
  host: {
    '[attr.data-slot]': '"context-menu"',
    style: 'display: contents;',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuComponent {
  private static activeMenu: ContextMenuComponent | null = null;
  readonly open = model<boolean>(false);

  readonly side = input<ContextMenuSide>('right');
  readonly sideOffset = input<number>(4);
  readonly minWidth = input<number>(128);
  readonly class = input<string>('');

  // Unique ID for this context menu instance
  readonly id = `context-menu-${contextMenuIdCounter++}`;

  // Position for the context menu (set on right-click)
  private readonly positionX = signal(0);
  private readonly positionY = signal(0);
  private readonly contentSide = signal<ContextMenuSide | null>(null);
  private readonly contentSideOffset = signal<number | null>(null);
  private readonly contentClassOverride = signal('');
  protected readonly renderedSide = signal<ContextMenuSide>('bottom');
  private readonly resolvedSide = computed(() => this.contentSide() ?? this.side());
  private readonly resolvedSideOffset = computed(
    () => this.contentSideOffset() ?? this.sideOffset()
  );

  private readonly overlay = inject(Overlay);
  private overlayRef: OverlayRef | null = null;
  private activeTriggerElement: HTMLElement | null = null;
  private readonly handleDocumentKeydown = (event: KeyboardEvent): void => {
    if (!this.open() || event.key !== 'Escape') {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    this.closeMenu();
  };

  protected readonly contentClass = computed(() =>
    cn(
      'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-[var(--radix-context-menu-content-available-height)] min-w-[8rem] origin-[var(--radix-context-menu-content-transform-origin)] overflow-x-hidden overflow-y-auto rounded-[10px] border p-1 shadow-md',
      this.class(),
      this.contentClassOverride()
    )
  );

  protected readonly menuPortal = viewChild<TemplateRef<unknown>>('menuPortal');
  protected readonly menuContent = viewChild<ElementRef<HTMLElement>>('menuContent');
  private readonly viewContainerRef = inject(ViewContainerRef);

  openAt(x: number, y: number, triggerElement?: HTMLElement): void {
    this.activateCurrentMenu();
    this.positionX.set(x);
    this.positionY.set(y);
    this.activeTriggerElement = triggerElement ?? null;
    if (this.open()) {
      // Reposition while already open (Radix behavior on repeated right-click)
      this.showOverlay();
      this.focusMenuContainer();
      return;
    }
    this.open.set(true);
    this.focusMenuContainer();
  }

  openMenu(): void {
    this.activateCurrentMenu();
    this.activeTriggerElement = null;
    if (this.positionX() === 0 && this.positionY() === 0) {
      this.positionX.set(8);
      this.positionY.set(8);
    }
    this.open.set(true);
    this.focusMenuContainer();
  }

  openFromTriggerElement(triggerElement: HTMLElement): void {
    const rect = triggerElement.getBoundingClientRect();
    this.openAt(rect.left + 2, rect.top + 2, triggerElement);
  }

  closeMenu(): void {
    if (ContextMenuComponent.activeMenu === this) {
      ContextMenuComponent.activeMenu = null;
    }
    this.activeTriggerElement = null;
    this.open.set(false);
  }

  constructor() {
    effect(() => {
      if (this.open()) {
        this.showOverlay();
      } else {
        this.hideOverlay();
      }
    });
  }

  private showOverlay(): void {
    if (this.overlayRef) {
      this.hideOverlay();
    }

    const resolvedSide = this.resolvedSide();
    const resolvedSideOffset = this.resolvedSideOffset();
    this.renderedSide.set(resolvedSide);

    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo({
        x: this.positionX(),
        y: this.positionY(),
      } as unknown as HTMLElement)
      .withPositions(this.buildPositionsForSide(resolvedSide, resolvedSideOffset))
      .withPush(true);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      minWidth: this.minWidth(),
    });

    // Create and attach portal
    const portal = new TemplatePortal(
      this.menuPortal()!,
      this.viewContainerRef,
      undefined
    );
    this.overlayRef.attach(portal);
    this.focusMenuContainer();
    this.addGlobalKeydownListener();

    // Handle outside pointer events
    this.overlayRef.outsidePointerEvents().subscribe((event) => {
      if (!this.shouldHandleOutsideClose(event)) {
        return;
      }
      this.closeMenu();
    });
  }

  private hideOverlay(): void {
    this.removeGlobalKeydownListener();
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  private addGlobalKeydownListener(): void {
    if (typeof document === 'undefined') {
      return;
    }
    document.addEventListener('keydown', this.handleDocumentKeydown, true);
  }

  private removeGlobalKeydownListener(): void {
    if (typeof document === 'undefined') {
      return;
    }
    document.removeEventListener('keydown', this.handleDocumentKeydown, true);
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

  private focusMenuContainer(): void {
    this.runAfterOverlayRender(() => {
      this.menuContent()?.nativeElement.focus({ preventScroll: true });
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

  private activateCurrentMenu(): void {
    if (
      ContextMenuComponent.activeMenu &&
      ContextMenuComponent.activeMenu !== this
    ) {
      ContextMenuComponent.activeMenu.closeMenuFromAnotherContext();
    }
    ContextMenuComponent.activeMenu = this;
  }

  private closeMenuFromAnotherContext(): void {
    this.activeTriggerElement = null;
    this.open.set(false);
  }

  private shouldHandleOutsideClose(event: MouseEvent): boolean {
    if (
      event.type !== 'pointerdown' &&
      event.type !== 'pointerup' &&
      event.type !== 'mousedown' &&
      event.type !== 'mouseup' &&
      event.type !== 'click' &&
      event.type !== 'touchstart' &&
      event.type !== 'touchend'
    ) {
      return false;
    }

    if (event.type === 'touchstart' || event.type === 'touchend') {
      return true;
    }

    // Ignore right/middle button events to prevent context-menu flash close.
    return event.button === 0;
  }

  registerContentConfig(config: {
    side?: ContextMenuSide;
    sideOffset?: number;
    className?: string;
  }): void {
    this.contentSide.set(config.side ?? null);
    this.contentSideOffset.set(config.sideOffset ?? null);
    this.contentClassOverride.set(config.className ?? '');
  }

  private buildPositionsForSide(
    side: ContextMenuSide,
    sideOffset: number
  ): ConnectedPosition[] {
    switch (side) {
      case 'top':
        return [
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
            offsetY: -sideOffset,
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'bottom',
            offsetY: -sideOffset,
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'top',
            offsetY: sideOffset,
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'top',
            offsetY: sideOffset,
          },
        ];
      case 'right':
        return [
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'top',
            offsetX: sideOffset,
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'top',
            offsetX: -sideOffset,
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
            offsetX: sideOffset,
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'bottom',
            offsetX: -sideOffset,
          },
        ];
      case 'left':
        return [
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'top',
            offsetX: -sideOffset,
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'top',
            offsetX: sideOffset,
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'bottom',
            offsetX: -sideOffset,
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
            offsetX: sideOffset,
          },
        ];
      case 'bottom':
      default:
        return [
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'top',
            offsetY: sideOffset,
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'top',
            offsetY: sideOffset,
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
            offsetY: -sideOffset,
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'bottom',
            offsetY: -sideOffset,
          },
        ];
    }
  }

}

// ============================================================================
// Context Menu Content (for API compatibility)
// ============================================================================

/**
 * Context Menu Content Component
 * Wrapper component that projects content into the root context menu
 * This is for API compatibility with the shadcn pattern
 */
@Component({
  selector: 'app-context-menu-content',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"context-menu-content"',
    style: 'display: contents;',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuContentComponent {
  private readonly contextMenu = inject(ContextMenuComponent);

  readonly side = input<ContextMenuSide>('right');
  readonly sideOffset = input<number>(4);
  readonly class = input<string>('');

  constructor() {
    effect(() => {
      this.contextMenu.registerContentConfig({
        side: this.side(),
        sideOffset: this.sideOffset(),
        className: this.class(),
      });
    });
  }
}

// ============================================================================
// Context Menu Portal (placeholder for API compatibility)
// ============================================================================

/**
 * Context Menu Portal Component
 * In Angular CDK, portals are handled by the Overlay system
 * This component exists for API compatibility
 */
@Directive({
  selector: 'app-context-menu-portal',
  host: {
    '[attr.data-slot]': '"context-menu-portal"',
  },
})
export class ContextMenuPortalComponent {
  // Portal functionality is handled by CDK Overlay in the root component
}

// ============================================================================
// Exports
// ============================================================================

export const ContextMenuComponents = [
  ContextMenuComponent,
  ContextMenuTriggerComponent,
  ContextMenuTriggerDirective,
  ContextMenuContentComponent,
  ContextMenuGroupComponent,
  ContextMenuLabelComponent,
  ContextMenuItemComponent,
  ContextMenuCheckboxItemComponent,
  ContextMenuRadioGroupComponent,
  ContextMenuRadioItemComponent,
  ContextMenuSeparatorComponent,
  ContextMenuShortcutComponent,
  ContextMenuSubComponent,
  ContextMenuSubTriggerComponent,
  ContextMenuSubContentComponent,
  ContextMenuPortalComponent,
];
