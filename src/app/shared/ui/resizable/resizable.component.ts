import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { cn } from '../../utils/cn';

/**
 * Panel size configuration
 */
export interface PanelSize {
  /** Size in pixels or percentage (e.g., '200px' or '30%') */
  size: number;
  /** Minimum size in pixels */
  minSize?: number;
  /** Maximum size in pixels */
  maxSize?: number;
}

/**
 * Panel constraint configuration
 */
export interface PanelConstraints {
  /** Minimum size percentage (0-100) */
  minSizePercentage?: number;
  /** Maximum size percentage (0-100) */
  maxSizePercentage?: number;
}

/**
 * Resizable panel group orientation
 */
export type ResizableOrientation = 'horizontal' | 'vertical';

/**
 * ResizablePanelGroupComponent - Container for resizable panels
 *
 * Aligned with shadcn/ui resizable pattern.
 * Reference: .vendor/aim/components/ui/resizable.tsx
 *
 * @example
 * ```html
 * <app-resizable-panel-group orientation="horizontal">
 *   <app-resizable-panel defaultSize="50">
 *     <div>Panel 1 Content</div>
 *   </app-resizable-panel>
 *   <app-resizable-handle withHandle />
 *   <app-resizable-panel defaultSize="50">
 *     <div>Panel 2 Content</div>
 *   </app-resizable-panel>
 * </app-resizable-panel-group>
 * ```
 */
@Component({
  selector: 'app-resizable-panel-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  host: {
    '[attr.data-slot]': '"resizable-panel-group"',
    '[attr.data-orientation]': 'orientation()',
    '[class]': 'computedClass()',
    '[style.--panel-group-size.px]': 'groupSize()',
    role: 'group',
  },
})
export class ResizablePanelGroupComponent {
  /** Orientation of the panel group */
  readonly orientation = input<ResizableOrientation>('horizontal');

  /** Additional CSS classes */
  readonly class = input<string>('');

  /** Auto-save ID for persisting panel sizes */
  readonly autoSaveId = input<string>('');

  /** Emitted when panel sizes change */
  readonly sizesChange = output<ReadonlyArray<number>>();

  /** Group size in pixels (set by resize observer) */
  protected readonly groupSize = signal<number>(0);

  /** Computed classes based on orientation */
  protected readonly computedClass = computed(() =>
    cn('flex h-full w-full', this.orientation() === 'vertical' && 'flex-col', this.class()),
  );

  private readonly elementRef = inject(ElementRef);
  private readonly resizeObserver: ResizeObserver;

  /** Panel size percentages */
  readonly panelSizes = signal<ReadonlyArray<number>>([]);

  constructor() {
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const size =
          this.orientation() === 'horizontal' ? entry.contentRect.width : entry.contentRect.height;
        this.groupSize.set(size);
      }
    });

    afterNextRender(() => {
      this.resizeObserver.observe(this.elementRef.nativeElement);

      // Load saved sizes if autoSaveId is provided
      if (this.autoSaveId()) {
        this.loadSavedSizes();
      }
    });

    // Save sizes when they change
    effect(() => {
      const sizes = this.panelSizes();
      if (this.autoSaveId() && sizes.length > 0) {
        this.saveSizes(sizes);
      }
    });
  }

  private loadSavedSizes(): void {
    const key = `resizable-${this.autoSaveId()}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const sizes = JSON.parse(saved) as number[];
        this.panelSizes.set(sizes);
      } catch {
        // Ignore parse errors
      }
    }
  }

  private saveSizes(sizes: ReadonlyArray<number>): void {
    const key = `resizable-${this.autoSaveId()}`;
    localStorage.setItem(key, JSON.stringify(sizes));
  }

  /** Update panel sizes */
  updatePanelSizes(sizes: ReadonlyArray<number>): void {
    this.panelSizes.set(sizes);
    this.sizesChange.emit(sizes);
  }

  /** Get total group size */
  getGroupSize(): number {
    return this.groupSize();
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
  }
}

/**
 * ResizablePanelComponent - Individual resizable panel
 *
 * @example
 * ```html
 * <app-resizable-panel defaultSize="50" minSize="10" maxSize="80">
 *   <div>Panel content</div>
 * </app-resizable-panel>
 * ```
 */
@Component({
  selector: 'app-resizable-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  host: {
    '[attr.data-slot]': '"resizable-panel"',
    '[class]': '"flex overflow-hidden"',
    '[style.flex-grow]': '0',
    '[style.flex-shrink]': '0',
    '[style.flex-basis.%]': 'sizePercentage()',
    role: 'presentation',
  },
})
export class ResizablePanelComponent {
  /** Default size as percentage (0-100) */
  readonly defaultSize = input<number>(50);

  /** Minimum size as percentage (0-100) */
  readonly minSize = input<number>(0);

  /** Maximum size as percentage (0-100) */
  readonly maxSize = input<number>(100);

  /** Additional CSS classes */
  readonly class = input<string>('');

  /** Panel ID for identification */
  readonly id = input<string>('');

  /** Current size percentage */
  readonly sizePercentage = signal<number>(50);

  private readonly elementRef = inject(ElementRef);

  constructor() {
    afterNextRender(() => {
      this.initializeSize();
    });
  }

  /** Find parent panel group element */
  private getParentGroupElement(): HTMLElement | null {
    let parent = this.elementRef.nativeElement.parentElement;
    while (parent) {
      if (parent.tagName === 'APP-RESIZABLE-PANEL-GROUP') {
        return parent;
      }
      parent = parent.parentElement;
    }
    return null;
  }

  private initializeSize(): void {
    const parentGroupEl = this.getParentGroupElement();
    const savedSizes = parentGroupEl
      ? (parentGroupEl as unknown as { panelSizes?: () => number[] }).panelSizes?.()
      : undefined;
    if (savedSizes && savedSizes.length > 0) {
      // Use saved size if available
      const index = this.getPanelIndex();
      if (index >= 0 && index < savedSizes.length) {
        this.sizePercentage.set(savedSizes[index]);
        return;
      }
    }
    // Use default size
    this.sizePercentage.set(this.defaultSize());
  }

  private getPanelIndex(): number {
    if (!this.elementRef.nativeElement.parentElement) return -1;
    const siblings = Array.from(this.elementRef.nativeElement.parentElement.children).filter(
      (el) => (el as HTMLElement).tagName === 'APP-RESIZABLE-PANEL',
    );
    return siblings.indexOf(this.elementRef.nativeElement);
  }

  /** Set the panel size */
  setSize(percentage: number): void {
    const clampedSize = Math.max(this.minSize(), Math.min(this.maxSize(), percentage));
    this.sizePercentage.set(clampedSize);
  }

  /** Get current size */
  getSize(): number {
    return this.sizePercentage();
  }
}

/**
 * ResizableHandleComponent - Draggable handle between panels
 *
 * @example
 * ```html
 * <app-resizable-handle withHandle />
 * ```
 */
@Component({
  selector: 'app-resizable-handle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (withHandle()) {
      <div class="bg-border z-10 h-6 w-1 flex-shrink-0 rounded-lg"></div>
    }
  `,
  host: {
    '[attr.data-slot]': '"resizable-handle"',
    '[attr.role]': '"separator"',
    '[attr.aria-orientation]': 'orientation()',
    '[attr.tabindex]': '0',
    '[class]': 'computedClass()',
    '(mousedown)': 'onMouseDown($event)',
    '(touchstart)': 'onTouchStart($event)',
    '(keydown)': 'onKeyDown($event)',
  },
})
export class ResizableHandleComponent {
  /** Show drag handle indicator */
  readonly withHandle = input<boolean>(false);

  /** Additional CSS classes */
  readonly class = input<string>('');

  /** Computed orientation from parent group */
  protected readonly orientation = signal<ResizableOrientation>('horizontal');

  /** Computed classes based on orientation */
  protected readonly computedClass = computed(() =>
    cn(
      'bg-border focus-visible:ring-ring ring-offset-background relative flex w-px items-center justify-center',
      'after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2',
      'focus-visible:ring-2 focus-visible:outline-hidden',
      'cursor-col-resize',
      this.orientation() === 'horizontal' ? 'cursor-col-resize' : 'cursor-row-resize',
      this.orientation() === 'vertical' &&
        'h-px w-full after:left-0 after:h-1 after:w-full after:translate-x-0 after:-translate-y-1/2',
      '[&[aria-orientation=horizontal]>div]:rotate-90',
      this.class(),
    ),
  );

  private readonly elementRef = inject(ElementRef);
  private isDragging = false;
  private startPos = 0;
  private startSizes: number[] = [];

  /** Find parent panel group element */
  private getParentGroupElement(): HTMLElement | null {
    let parent = this.elementRef.nativeElement.parentElement;
    while (parent) {
      if (parent.tagName === 'APP-RESIZABLE-PANEL-GROUP') {
        return parent;
      }
      parent = parent.parentElement;
    }
    return null;
  }

  /** Get panel group component instance */
  private getParentGroup(): { updatePanelSizes: (sizes: number[]) => void } | null {
    const parentGroupEl = this.getParentGroupElement();
    if (!parentGroupEl) return null;
    return parentGroupEl as unknown as { updatePanelSizes: (sizes: number[]) => void };
  }

  constructor() {
    afterNextRender(() => {
      this.detectOrientation();
    });
  }

  private detectOrientation(): void {
    const parentGroupEl = this.getParentGroupElement();
    if (parentGroupEl) {
      const dataOrientation = parentGroupEl.getAttribute('data-orientation');
      if (dataOrientation === 'vertical' || dataOrientation === 'horizontal') {
        this.orientation.set(dataOrientation);
        return;
      }
    }

    const parent = this.elementRef.nativeElement.parentElement;
    if (parent) {
      const isVertical = parent.classList.contains('flex-col');
      this.orientation.set(isVertical ? 'vertical' : 'horizontal');
    }
  }

  private getContainerSize(parent: HTMLElement): number {
    return this.orientation() === 'horizontal' ? parent.offsetWidth : parent.offsetHeight;
  }

  private getPanels(parent: HTMLElement): HTMLElement[] {
    return Array.from(parent.children).filter(
      (child): child is HTMLElement =>
        child instanceof HTMLElement && child.tagName === 'APP-RESIZABLE-PANEL',
    );
  }

  private getPanelSize(panel: HTMLElement): number {
    return this.orientation() === 'horizontal' ? panel.offsetWidth : panel.offsetHeight;
  }

  private getAdjacentPanelIndices(
    parent: HTMLElement,
  ): { prevPanelIndex: number; nextPanelIndex: number } | null {
    const children = Array.from(parent.children) as HTMLElement[];
    const handleIndex = children.indexOf(this.elementRef.nativeElement);
    if (handleIndex < 0) {
      return null;
    }

    let prevPanel: HTMLElement | null = null;
    let nextPanel: HTMLElement | null = null;

    for (let i = handleIndex - 1; i >= 0; i--) {
      if (children[i].tagName === 'APP-RESIZABLE-PANEL') {
        prevPanel = children[i];
        break;
      }
    }

    for (let i = handleIndex + 1; i < children.length; i++) {
      if (children[i].tagName === 'APP-RESIZABLE-PANEL') {
        nextPanel = children[i];
        break;
      }
    }

    if (!prevPanel || !nextPanel) {
      return null;
    }

    const panels = this.getPanels(parent);
    const prevPanelIndex = panels.indexOf(prevPanel);
    const nextPanelIndex = panels.indexOf(nextPanel);

    if (prevPanelIndex < 0 || nextPanelIndex < 0) {
      return null;
    }

    return { prevPanelIndex, nextPanelIndex };
  }

  private onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    this.startDragging(event.clientX, event.clientY);

    const onMouseMove = (e: MouseEvent): void => {
      this.onDrag(e.clientX, e.clientY);
    };

    const onMouseUp = (): void => {
      this.stopDragging();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  private onTouchStart(event: TouchEvent): void {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      this.startDragging(touch.clientX, touch.clientY);

      const onTouchMove = (e: TouchEvent): void => {
        if (e.touches.length === 1) {
          this.onDrag(e.touches[0].clientX, e.touches[0].clientY);
        }
      };

      const onTouchEnd = (): void => {
        this.stopDragging();
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
      };

      document.addEventListener('touchmove', onTouchMove);
      document.addEventListener('touchend', onTouchEnd);
    }
  }

  private startDragging(clientX: number, clientY: number): void {
    this.isDragging = true;
    this.startPos = this.orientation() === 'horizontal' ? clientX : clientY;

    const parent = this.elementRef.nativeElement.parentElement;
    if (!parent) return;
    const groupSize = this.getContainerSize(parent);
    if (groupSize <= 0) return;

    const panels = this.getPanels(parent);
    this.startSizes = panels.map((panel) => (this.getPanelSize(panel) / groupSize) * 100);
  }

  private onDrag(clientX: number, clientY: number): void {
    if (!this.isDragging) return;

    const parent = this.elementRef.nativeElement.parentElement;
    if (!parent) return;

    const currentPos = this.orientation() === 'horizontal' ? clientX : clientY;
    const groupSize = this.getContainerSize(parent);
    if (groupSize <= 0) return;
    const delta = ((currentPos - this.startPos) / groupSize) * 100;

    const panelIndices = this.getAdjacentPanelIndices(parent);
    if (!panelIndices) return;
    const { prevPanelIndex, nextPanelIndex } = panelIndices;

    const newSizes = [...this.startSizes];
    if (prevPanelIndex >= newSizes.length || nextPanelIndex >= newSizes.length) {
      return;
    }

    const newPrevSize = newSizes[prevPanelIndex] + delta;
    const newNextSize = newSizes[nextPanelIndex] - delta;

    // Apply constraints (min 5%, max 95%)
    const minPercent = 5;
    const maxPercent = 95;

    if (newPrevSize >= minPercent && newNextSize >= minPercent) {
      newSizes[prevPanelIndex] = Math.min(maxPercent, Math.max(minPercent, newPrevSize));
      newSizes[nextPanelIndex] = Math.min(maxPercent, Math.max(minPercent, newNextSize));

      const panels = this.getPanels(parent);
      panels.forEach((panel, index) => {
        panel.style.flexBasis = `${newSizes[index]}%`;
      });
      this.getParentGroup()?.updatePanelSizes(newSizes);
    }
  }

  private stopDragging(): void {
    this.isDragging = false;
  }

  private onKeyDown(event: KeyboardEvent): void {
    const step = event.shiftKey ? 10 : 1;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        this.resizeBy(-step);
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        this.resizeBy(step);
        break;
      case 'Home':
        event.preventDefault();
        this.resetSizes();
        break;
    }
  }

  private resizeBy(delta: number): void {
    const parent = this.elementRef.nativeElement.parentElement;
    if (!parent) return;
    const groupSize = this.getContainerSize(parent);
    if (groupSize <= 0) return;

    const panelIndices = this.getAdjacentPanelIndices(parent);
    if (!panelIndices) return;
    const { prevPanelIndex, nextPanelIndex } = panelIndices;

    const panels = this.getPanels(parent);
    const prevPanel = panels[prevPanelIndex];
    const nextPanel = panels[nextPanelIndex];
    if (!prevPanel || !nextPanel) return;

    const prevSize = (this.getPanelSize(prevPanel) / groupSize) * 100;
    const nextSize = (this.getPanelSize(nextPanel) / groupSize) * 100;

    const newPrevSize = Math.max(5, Math.min(95, prevSize + delta));
    const newNextSize = Math.max(5, Math.min(95, nextSize - delta));

    if (newPrevSize >= 5 && newNextSize >= 5) {
      prevPanel.style.flexBasis = `${newPrevSize}%`;
      nextPanel.style.flexBasis = `${newNextSize}%`;

      const updatedSizes = panels.map((panel) => (this.getPanelSize(panel) / groupSize) * 100);
      updatedSizes[prevPanelIndex] = newPrevSize;
      updatedSizes[nextPanelIndex] = newNextSize;
      this.getParentGroup()?.updatePanelSizes(updatedSizes);
    }
  }

  private resetSizes(): void {
    const parent = this.elementRef.nativeElement.parentElement;
    if (!parent) return;

    const panels = this.getPanels(parent);
    if (panels.length === 0) return;
    const equalSize = 100 / panels.length;

    panels.forEach((panel) => {
      panel.style.flexBasis = `${equalSize}%`;
    });
    this.getParentGroup()?.updatePanelSizes(panels.map(() => equalSize));
  }
}

// Export all components
export const ResizableComponents = [
  ResizablePanelGroupComponent,
  ResizablePanelComponent,
  ResizableHandleComponent,
];
