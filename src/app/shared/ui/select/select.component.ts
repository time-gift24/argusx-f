import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  ElementRef,
  effect,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ConnectedOverlayPositionChange,
  CdkOverlayOrigin,
  OverlayModule,
  ConnectedPosition,
} from '@angular/cdk/overlay';
import { cn } from '../../utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  LucideAngularModule,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
} from 'lucide-angular';

// Aligned with official shadcn preset (.vendor/aim/components/ui/select.tsx)
const selectTriggerVariants = cva(
  "border-input data-placeholder:text-muted-foreground bg-input/20 dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 gap-1.5 rounded-md border px-2 py-1.5 text-xs/relaxed transition-colors focus-visible:ring-2 aria-invalid:ring-2 *:data-[slot=select-value]:gap-1.5 [&_svg:not([class*='size-'])]:size-3.5 flex w-fit items-center justify-between whitespace-nowrap outline-none disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      size: {
        default: 'h-7',
        sm: 'h-6',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

type SelectTriggerVariants = VariantProps<typeof selectTriggerVariants>;

export type SelectSize = NonNullable<SelectTriggerVariants['size']>;

abstract class SelectRootToken<T = unknown> {
  abstract readonly value: () => T | undefined;
  abstract readonly highlightedValue: () => T | undefined;
  abstract selectValue(value: T | undefined): void;
  abstract setHighlightedValue(value: T | undefined): void;
}

// Select Item Component
@Component({
  selector: 'app-select-item',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <span class="pointer-events-none absolute right-2 flex items-center justify-center">
      @if (isSelected()) {
        <lucide-icon [img]="checkIcon" class="size-3.5 pointer-events-none" />
      }
    </span>
    <span class="flex-1">
      <ng-content />
    </span>
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"select-item"',
    '[attr.data-state]': 'isSelected() ? "checked" : "unchecked"',
    '[attr.data-highlighted]': 'isHighlighted() ? "" : null',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.role]': '"option"',
    '[attr.aria-selected]': 'isSelected()',
    '[attr.tabindex]': 'disabled() ? null : "-1"',
    '(click)': 'onClick()',
    '(mousemove)': 'onMouseMove()',
    '(keydown)': 'onKeydown($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectItemComponent<T = string> {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly selectRoot = inject<SelectRootToken<T> | null>(
    SelectRootToken as unknown as abstract new (...args: never[]) => SelectRootToken<T>,
    { optional: true }
  );

  readonly value = input.required<T>();
  readonly class = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly selectValue = input<T | undefined>(undefined);
  readonly selectOnChange = output<T>();

  protected readonly checkIcon = CheckIcon;

  protected readonly computedClass = computed(() =>
    cn(
      'focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground not-data-[variant=destructive]:data-[highlighted]:**:text-accent-foreground min-h-7 gap-2 rounded-md px-2 py-1 text-xs/relaxed [&_svg:not([class*=\'size-\'])]:size-3.5 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
      this.class()
    )
  );

  protected readonly isSelected = computed(() =>
    this.selectRoot ? this.selectRoot.value() === this.value() : this.selectValue() === this.value()
  );

  protected readonly isHighlighted = computed(
    () => this.selectRoot?.highlightedValue() === this.value()
  );

  onClick(): void {
    if (this.disabled()) return;
    if (this.selectRoot) {
      this.selectRoot.selectValue(this.value());
      return;
    }
    this.selectOnChange.emit(this.value());
  }

  onMouseMove(): void {
    if (this.disabled() || !this.selectRoot) return;
    this.selectRoot.setHighlightedValue(this.value());
    this.focus();
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this.onClick();
  }

  focus(): void {
    if (this.disabled()) return;
    this.host.nativeElement.focus();
  }

  getElement(): HTMLElement {
    return this.host.nativeElement;
  }

  getLabel(): string {
    return this.host.nativeElement.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  }
}

// Select Group Component
@Component({
  selector: 'app-select-group',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"select-group"',
    role: 'group',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectGroupComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('block scroll-my-1 p-1', this.class())
  );
}

// Select Label Component
@Component({
  selector: 'app-select-label',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"select-label"',
    role: 'presentation',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectLabelComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('block text-muted-foreground px-2 py-1.5 text-xs', this.class())
  );
}

// Select Separator Component
@Component({
  selector: 'app-select-separator',
  imports: [CommonModule],
  template: '',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"select-separator"',
    role: 'separator',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectSeparatorComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('block bg-border/50 -mx-1 my-1 h-px pointer-events-none', this.class())
  );
}

// Select Scroll Up Button Component
@Component({
  selector: 'app-select-scroll-up',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <lucide-icon [img]="chevronUpIcon" />
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"select-scroll-up-button"',
    role: 'presentation',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectScrollUpComponent {
  readonly class = input<string>('');

  protected readonly chevronUpIcon = ChevronUpIcon;

  protected readonly computedClass = computed(() =>
    cn(
      'bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*=\'size-\'])]:size-3.5',
      this.class()
    )
  );
}

// Select Scroll Down Button Component
@Component({
  selector: 'app-select-scroll-down',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <lucide-icon [img]="chevronDownIcon" />
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"select-scroll-down-button"',
    role: 'presentation',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectScrollDownComponent {
  readonly class = input<string>('');

  protected readonly chevronDownIcon = ChevronDownIcon;

  protected readonly computedClass = computed(() =>
    cn(
      'bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*=\'size-\'])]:size-3.5',
      this.class()
    )
  );
}

// Select Root Component
let selectContentIdCounter = 0;

@Component({
  selector: 'app-select',
  imports: [
    CommonModule,
    OverlayModule,
    LucideAngularModule,
    SelectScrollUpComponent,
    SelectScrollDownComponent,
  ],
  providers: [
    {
      provide: SelectRootToken,
      useExisting: forwardRef(() => SelectComponent),
    },
  ],
  template: `
    <div class="inline-flex">
      <!-- Trigger -->
      <button
        type="button"
        cdkOverlayOrigin
        #trigger="cdkOverlayOrigin"
        [class]="triggerClass()"
        [attr.data-slot]="'select-trigger'"
        [attr.data-size]="size()"
        [attr.data-placeholder]="!value() ? '' : null"
        [attr.role]="'combobox'"
        [attr.aria-haspopup]="'listbox'"
        [attr.aria-controls]="isOpen() ? contentId : null"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-disabled]="disabled()"
        [attr.aria-invalid]="invalid()"
        [disabled]="disabled()"
        (click)="toggle()"
        (keydown)="onTriggerKeydown($event)">
        <span data-slot="select-value" class="flex items-center gap-1.5 line-clamp-1">
          <ng-content select="app-select-value" />
        </span>
        <lucide-icon
          [img]="chevronDownIcon"
          class="text-muted-foreground size-3.5 pointer-events-none" />
      </button>

      <!-- Dropdown -->
      <ng-template
        cdkConnectedOverlay
        [cdkConnectedOverlayOrigin]="trigger"
        [cdkConnectedOverlayOpen]="isOpen()"
        [cdkConnectedOverlayPositions]="positions()"
        [cdkConnectedOverlayWidth]="position() === 'popper' ? triggerWidth() : null"
        (attach)="onOverlayAttach()"
        (positionChange)="onPositionChange($event)"
        (overlayOutsideClick)="onOutsideClick($event)"
        (detach)="onOverlayDetach()">
        <div
          #contentPanel
          [class]="contentClass()"
          [id]="contentId"
          [attr.data-slot]="'select-content'"
          [attr.data-state]="isOpen() ? 'open' : 'closed'"
          [attr.data-side]="overlaySide()"
          [attr.data-align-trigger]="position() === 'item-aligned' ? true : null"
          [style.margin-top.px]="position() === 'item-aligned' ? contentOffsetY() : null"
          role="listbox"
          tabindex="-1"
          (scroll)="onViewportScroll()"
          (keydown)="onContentKeydown($event)">
          @if (showScrollUpButton()) {
            <app-select-scroll-up (click)="scrollViewport(-40)" />
          }
          <div
            #viewport
            [attr.data-position]="position()"
            class="data-[position=popper]:h-(--radix-select-trigger-height) data-[position=popper]:w-full data-[position=popper]:min-w-(--radix-select-trigger-width)">
            <ng-content select="app-select-group, app-select-item, app-select-separator" />
          </div>
          @if (showScrollDownButton()) {
            <app-select-scroll-down (click)="scrollViewport(40)" />
          }
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `],
  host: {
    '[attr.data-slot]': '"select"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent<T = string> extends SelectRootToken<T> {
  readonly value = model<T | undefined>(undefined);
  readonly disabled = input<boolean>(false);
  readonly placeholder = input<string>('Select an option');
  readonly size = input<SelectSize>('default');
  readonly position = input<'item-aligned' | 'popper'>('item-aligned');
  readonly invalid = input<boolean>(false);
  readonly class = input<string>('');

  readonly valueChange = output<T | undefined>();
  readonly highlightedValue = signal<T | undefined>(undefined);
  readonly contentId = `app-select-content-${selectContentIdCounter++}`;

  // Internal state
  readonly isOpen = signal(false);
  protected readonly items = contentChildren(SelectItemComponent, {
    descendants: true,
  });
  protected readonly trigger = viewChild(CdkOverlayOrigin);
  protected readonly contentPanel = viewChild<ElementRef<HTMLDivElement>>('contentPanel');
  protected readonly viewport = viewChild<ElementRef<HTMLDivElement>>('viewport');
  protected readonly showScrollUpButton = signal(false);
  protected readonly showScrollDownButton = signal(false);
  protected readonly overlaySide = signal<'top' | 'bottom' | 'left' | 'right'>('bottom');
  protected readonly contentOffsetY = signal(0);

  private openDirection: 1 | -1 | 0 = 0;

  protected readonly chevronDownIcon = ChevronDownIcon;

  protected readonly positions = computed<ConnectedPosition[]>(() => {
    const sideOffset = this.position() === 'popper' ? 4 : 0;
    return [
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
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
    ];
  });

  protected readonly triggerClass = computed(() =>
    cn(selectTriggerVariants({ size: this.size() }), this.class())
  );

  protected readonly contentClass = computed(() =>
    cn(
      'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 min-w-32 rounded-lg shadow-md ring-1 duration-100 relative z-50 max-h-(--radix-select-content-available-height) origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto data-[align-trigger=true]:animate-none',
      this.position() === 'popper'
        ? 'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1'
        : null
    )
  );

  protected readonly triggerWidth = computed(() => {
    const triggerEl = this.trigger()?.elementRef?.nativeElement;
    return triggerEl?.offsetWidth ?? 150;
  });

  constructor() {
    super();
    effect(() => {
      if (this.isOpen()) {
        queueMicrotask(() => this.initializeOpenState());
        return;
      }
      this.showScrollUpButton.set(false);
      this.showScrollDownButton.set(false);
      this.highlightedValue.set(undefined);
      this.contentOffsetY.set(0);
      this.openDirection = 0;
    });
  }

  setValue(newValue: T | undefined): void {
    this.selectValue(newValue);
  }

  selectValue(newValue: T | undefined): void {
    this.value.set(newValue);
    this.valueChange.emit(newValue);
    this.close();
  }

  open(direction: 1 | -1 | 0 = 0): void {
    if (!this.disabled()) {
      this.openDirection = direction;
      this.isOpen.set(true);
    }
  }

  close(options: { focusTrigger?: boolean } = {}): void {
    this.isOpen.set(false);
    if (options.focusTrigger ?? true) {
      queueMicrotask(() => this.trigger()?.elementRef.nativeElement.focus());
    }
  }

  toggle(): void {
    if (this.disabled()) return;
    if (this.isOpen()) {
      this.close({ focusTrigger: false });
      return;
    }
    this.open();
  }

  onOutsideClick(event: MouseEvent): void {
    const triggerEl = this.trigger()?.elementRef?.nativeElement;
    if (triggerEl && !triggerEl.contains(event.target as Node)) {
      this.close({ focusTrigger: false });
    }
  }

  onOverlayAttach(): void {
    queueMicrotask(() => this.updateScrollButtonVisibility());
  }

  onOverlayDetach(): void {
    if (this.isOpen()) {
      this.close({ focusTrigger: false });
    }
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.isOpen()) {
        this.moveHighlight(1);
      } else {
        this.open(1);
      }
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.isOpen()) {
        this.moveHighlight(-1);
      } else {
        this.open(-1);
      }
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.open();
    }
  }

  onContentKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.moveHighlight(1);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.moveHighlight(-1);
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      this.focusBoundary('start');
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      this.focusBoundary('end');
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectHighlightedValue();
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }
    if (event.key === 'Tab') {
      this.close({ focusTrigger: false });
    }
  }

  onPositionChange(event: ConnectedOverlayPositionChange): void {
    const pair = event.connectionPair;
    if (pair.originY === 'bottom' && pair.overlayY === 'top') {
      this.overlaySide.set('bottom');
      return;
    }
    if (pair.originY === 'top' && pair.overlayY === 'bottom') {
      this.overlaySide.set('top');
      return;
    }
    if (pair.originX === 'start' && pair.overlayX === 'end') {
      this.overlaySide.set('left');
      return;
    }
    if (pair.originX === 'end' && pair.overlayX === 'start') {
      this.overlaySide.set('right');
    }
  }

  onViewportScroll(): void {
    this.updateScrollButtonVisibility();
  }

  setHighlightedValue(value: T | undefined): void {
    if (value === undefined) {
      this.highlightedValue.set(undefined);
      return;
    }
    if (this.findEnabledItemIndex(value) === -1) {
      return;
    }
    this.highlightedValue.set(value);
  }

  scrollViewport(deltaY: number): void {
    const viewportEl = this.contentPanel()?.nativeElement;
    if (!viewportEl) return;
    viewportEl.scrollBy({ top: deltaY, behavior: 'smooth' });
    queueMicrotask(() => this.updateScrollButtonVisibility());
  }

  private initializeOpenState(): void {
    this.setInitialHighlight();
    this.focusHighlightedItem();
    this.updateScrollButtonVisibility();
    queueMicrotask(() => this.updateItemAlignedOffset());
  }

  private setInitialHighlight(): void {
    const enabledItems = this.getEnabledItems();
    if (enabledItems.length === 0) {
      this.highlightedValue.set(undefined);
      return;
    }

    const currentValue = this.value();
    const selectedIndex = this.findEnabledItemIndex(currentValue);
    if (selectedIndex >= 0) {
      this.highlightedValue.set(enabledItems[selectedIndex].value() as T);
      return;
    }

    const boundary = this.openDirection === -1 ? enabledItems.length - 1 : 0;
    this.highlightedValue.set(enabledItems[boundary].value() as T);
  }

  private moveHighlight(direction: 1 | -1): void {
    const enabledItems = this.getEnabledItems();
    if (enabledItems.length === 0) return;

    const currentIndex = this.findEnabledItemIndex(this.highlightedValue());
    const fallbackIndex = this.findEnabledItemIndex(this.value());
    const startIndex = currentIndex >= 0 ? currentIndex : fallbackIndex;
    const nextIndex =
      startIndex >= 0
        ? (startIndex + direction + enabledItems.length) % enabledItems.length
        : direction > 0
          ? 0
          : enabledItems.length - 1;

    this.highlightedValue.set(enabledItems[nextIndex].value() as T);
    this.focusHighlightedItem();
  }

  private focusBoundary(boundary: 'start' | 'end'): void {
    const enabledItems = this.getEnabledItems();
    if (enabledItems.length === 0) return;
    const item = boundary === 'start' ? enabledItems[0] : enabledItems[enabledItems.length - 1];
    this.highlightedValue.set(item.value() as T);
    item.focus();
    this.scrollItemIntoView(item);
  }

  private selectHighlightedValue(): void {
    const highlighted = this.highlightedValue();
    if (highlighted === undefined) {
      return;
    }
    this.selectValue(highlighted);
  }

  private focusHighlightedItem(): void {
    const highlighted = this.highlightedValue();
    if (highlighted === undefined) return;
    const item = this.getEnabledItems().find((candidate) => candidate.value() === highlighted);
    if (!item) return;
    item.focus();
    this.scrollItemIntoView(item);
  }

  private scrollItemIntoView(item: SelectItemComponent): void {
    item.getElement().scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
    });
    queueMicrotask(() => this.updateScrollButtonVisibility());
  }

  private getEnabledItems(): SelectItemComponent[] {
    return this.items().filter((item) => !item.disabled());
  }

  private findEnabledItemIndex(value: T | undefined): number {
    if (value === undefined) return -1;
    return this.getEnabledItems().findIndex((item) => item.value() === value);
  }

  private updateScrollButtonVisibility(): void {
    const viewportEl = this.contentPanel()?.nativeElement;
    if (!viewportEl) {
      this.showScrollUpButton.set(false);
      this.showScrollDownButton.set(false);
      return;
    }

    const hasOverflow = viewportEl.scrollHeight > viewportEl.clientHeight + 1;
    if (!hasOverflow) {
      this.showScrollUpButton.set(false);
      this.showScrollDownButton.set(false);
      return;
    }

    this.showScrollUpButton.set(viewportEl.scrollTop > 0);
    this.showScrollDownButton.set(
      viewportEl.scrollTop + viewportEl.clientHeight < viewportEl.scrollHeight - 1
    );
  }

  private updateItemAlignedOffset(): void {
    if (this.position() !== 'item-aligned') {
      this.contentOffsetY.set(0);
      return;
    }

    const triggerEl = this.trigger()?.elementRef?.nativeElement;
    const panelEl = this.contentPanel()?.nativeElement;
    if (!triggerEl || !panelEl) {
      this.contentOffsetY.set(0);
      return;
    }

    const selectedItem = this.getEnabledItems().find((item) => item.value() === this.value());
    if (!selectedItem) {
      this.contentOffsetY.set(0);
      return;
    }

    const triggerRect = triggerEl.getBoundingClientRect();
    const panelRect = panelEl.getBoundingClientRect();
    const selectedRect = selectedItem.getElement().getBoundingClientRect();

    const triggerCenterY = triggerRect.top + triggerRect.height / 2;
    const selectedCenterY = selectedRect.top + selectedRect.height / 2;
    const desiredDelta = triggerCenterY - selectedCenterY;

    const minViewportPadding = 8;
    const minTop = minViewportPadding;
    const maxTop = window.innerHeight - minViewportPadding - panelRect.height;
    const unclampedTop = panelRect.top + desiredDelta;
    const clampedTop = Math.min(Math.max(unclampedTop, minTop), maxTop);
    const clampedDelta = clampedTop - panelRect.top;

    this.contentOffsetY.set(Math.round(clampedDelta));
  }
}

// Select Value Component (for projection)
@Component({
  selector: 'app-select-value',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'class()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectValueComponent {
  readonly class = input<string>('');
}

// Re-export all components
export const SelectComponents = [
  SelectComponent,
  SelectValueComponent,
  SelectItemComponent,
  SelectGroupComponent,
  SelectLabelComponent,
  SelectSeparatorComponent,
  SelectScrollUpComponent,
  SelectScrollDownComponent,
];
