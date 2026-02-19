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
  SquareIcon,
  ChevronRightIcon,
} from 'lucide-angular';

// ============================================================================
// Types
// ============================================================================

export type ArgusxContextMenuItemVariant = 'default' | 'destructive';
export type ArgusxContextMenuSide = 'top' | 'right' | 'bottom' | 'left';

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
  selector: '[argusxContextMenuTrigger]',
  host: {
    '[attr.data-slot]': '"context-menu-trigger"',
    '[attr.aria-expanded]': 'contextMenu.open()',
    '[attr.aria-haspopup]': '"menu"',
    '(contextmenu)': 'onContextMenu($event)',
    '(keydown)': 'onKeydown($event)',
  },
})
export class ArgusxContextMenuTriggerDirective {
  readonly contextMenu = inject(ArgusxContextMenuComponent);
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
  selector: 'argusx-context-menu-trigger',
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
export class ArgusxContextMenuTriggerComponent {
  readonly contextMenu = inject(ArgusxContextMenuComponent);
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
  selector: 'argusx-context-menu-group',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"context-menu-group"',
    role: 'group',
    style: 'display: contents;',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxContextMenuGroupComponent {
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
  selector: 'argusx-context-menu-label',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"context-menu-label"',
    '[attr.data-inset]': 'inset() ? "" : null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxContextMenuLabelComponent {
  readonly inset = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(argusxMenuLabelVariants({ inset: this.inset() }), this.class())
  );
}

// ============================================================================
// Context Menu Item
// ============================================================================

/**
 * Context Menu Item Component
 * Individual menu item
 */
@Component({
  selector: 'argusx-context-menu-item',
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
export class ArgusxContextMenuItemComponent {
  readonly contextMenu = inject(ArgusxContextMenuComponent);

  readonly inset = input<boolean>(false);
  readonly variant = input<ArgusxContextMenuItemVariant>('default');
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
  selector: 'argusx-context-menu-checkbox-item',
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
export class ArgusxContextMenuCheckboxItemComponent {
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
// Context Menu Radio Group
// ============================================================================

/**
 * Context Menu Radio Group Component
 * Groups radio items together
 */
@Component({
  selector: 'argusx-context-menu-radio-group',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"context-menu-radio-group"',
    role: 'group',
    style: 'display: contents;',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxContextMenuRadioGroupComponent {
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
  selector: 'argusx-context-menu-radio-item',
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
export class ArgusxContextMenuRadioItemComponent {
  readonly contextMenu = inject(ArgusxContextMenuComponent);
  readonly radioGroup = inject(ArgusxContextMenuRadioGroupComponent, { optional: true });

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
  selector: 'argusx-context-menu-separator',
  imports: [CommonModule],
  template: '',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"context-menu-separator"',
    role: 'separator',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxContextMenuSeparatorComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(argusxMenuSeparatorVariants(), this.class())
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
  selector: 'argusx-context-menu-shortcut',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"context-menu-shortcut"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxContextMenuShortcutComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(argusxMenuShortcutVariants(), this.class())
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
  selector: 'argusx-context-menu-sub',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"context-menu-sub"',
    style: 'display: contents;',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxContextMenuSubComponent {
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
  selector: 'argusx-context-menu-sub-trigger',
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
export class ArgusxContextMenuSubTriggerComponent {
  readonly subMenu = inject(ArgusxContextMenuSubComponent, { optional: true });
  readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly inset = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly subTriggerIcon = ChevronRightIcon;

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
// Context Menu Sub Content
// ============================================================================

/**
 * Context Menu Sub Content Component
 * The submenu panel - uses fixed positioning to escape overflow constraints
 */
@Component({
  selector: 'argusx-context-menu-sub-content',
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
export class ArgusxContextMenuSubContentComponent {
  readonly subMenu = inject(ArgusxContextMenuSubComponent, { optional: true });
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

  protected readonly computedSide = computed<ArgusxContextMenuSide>(() => {
    const rect = this.subMenu?.triggerPosition();
    if (!rect || typeof window === 'undefined') {
      return 'right';
    }

    const submenuWidth = 192;
    return rect.right + 4 + submenuWidth > window.innerWidth ? 'left' : 'right';
  });

  protected readonly contentClass = computed(() =>
    cn(
      argusxMenuSubContentVariants(),
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
  selector: 'argusx-context-menu',
  imports: [
    CommonModule,
    OverlayModule,
    PortalModule,
  ],
  template: `
    <!-- Trigger element (projected content) -->
    <ng-content select="[argusxContextMenuTrigger], argusx-context-menu-trigger" />

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
export class ArgusxContextMenuComponent {
  private static activeMenu: ArgusxContextMenuComponent | null = null;
  readonly open = model<boolean>(false);

  readonly side = input<ArgusxContextMenuSide>('right');
  readonly sideOffset = input<number>(4);
  readonly minWidth = input<number>(128);
  readonly class = input<string>('');

  // Unique ID for this context menu instance
  readonly id = `context-menu-${contextMenuIdCounter++}`;

  // Position for the context menu (set on right-click)
  private readonly positionX = signal(0);
  private readonly positionY = signal(0);
  private readonly contentSide = signal<ArgusxContextMenuSide | null>(null);
  private readonly contentSideOffset = signal<number | null>(null);
  private readonly contentClassOverride = signal('');
  protected readonly renderedSide = signal<ArgusxContextMenuSide>('bottom');
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
      argusxMenuContentVariants(),
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
    if (ArgusxContextMenuComponent.activeMenu === this) {
      ArgusxContextMenuComponent.activeMenu = null;
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
    runAfterRender(() => {
      focusMenuItemByIndex(
        getMenuFocusableItems(this.menuContent()?.nativeElement),
        index
      );
    });
  }

  private focusMenuContainer(): void {
    runAfterRender(() => {
      this.menuContent()?.nativeElement.focus({ preventScroll: true });
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

  private activateCurrentMenu(): void {
    if (
      ArgusxContextMenuComponent.activeMenu &&
      ArgusxContextMenuComponent.activeMenu !== this
    ) {
      ArgusxContextMenuComponent.activeMenu.closeMenuFromAnotherContext();
    }
    ArgusxContextMenuComponent.activeMenu = this;
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
    side?: ArgusxContextMenuSide;
    sideOffset?: number;
    className?: string;
  }): void {
    this.contentSide.set(config.side ?? null);
    this.contentSideOffset.set(config.sideOffset ?? null);
    this.contentClassOverride.set(config.className ?? '');
  }

  private buildPositionsForSide(
    side: ArgusxContextMenuSide,
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
  selector: 'argusx-context-menu-content',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"context-menu-content"',
    style: 'display: contents;',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxContextMenuContentComponent {
  private readonly contextMenu = inject(ArgusxContextMenuComponent);

  readonly side = input<ArgusxContextMenuSide>('right');
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
  selector: 'argusx-context-menu-portal',
  host: {
    '[attr.data-slot]': '"context-menu-portal"',
  },
})
export class ArgusxContextMenuPortalComponent {
  // Portal functionality is handled by CDK Overlay in the root component
}

// ============================================================================
// Exports
// ============================================================================

export const ArgusxContextMenuComponents = [
  ArgusxContextMenuComponent,
  ArgusxContextMenuTriggerComponent,
  ArgusxContextMenuTriggerDirective,
  ArgusxContextMenuContentComponent,
  ArgusxContextMenuGroupComponent,
  ArgusxContextMenuLabelComponent,
  ArgusxContextMenuItemComponent,
  ArgusxContextMenuCheckboxItemComponent,
  ArgusxContextMenuRadioGroupComponent,
  ArgusxContextMenuRadioItemComponent,
  ArgusxContextMenuSeparatorComponent,
  ArgusxContextMenuShortcutComponent,
  ArgusxContextMenuSubComponent,
  ArgusxContextMenuSubTriggerComponent,
  ArgusxContextMenuSubContentComponent,
  ArgusxContextMenuPortalComponent,
];
