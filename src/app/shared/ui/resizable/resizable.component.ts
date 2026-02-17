import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  inject,
  InjectionToken,
  input,
  OnDestroy,
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

interface ResizablePanelApi {
  getHostElement(): HTMLElement;
  getSize(): number;
  getDefaultSize(): number;
  getMinSize(): number;
  getMaxSize(): number;
  setSize(percentage: number): void;
}

interface ResizableGroupContext {
  readonly orientation: () => ResizableOrientation;
  readonly panelSizes: () => ReadonlyArray<number>;
  updatePanelSizes(sizes: ReadonlyArray<number>): void;
  registerPanel(panel: ResizablePanelApi): void;
  unregisterPanel(panel: ResizablePanelApi): void;
  getPanels(): ReadonlyArray<ResizablePanelApi>;
}

const RESIZABLE_GROUP = new InjectionToken<ResizableGroupContext>('RESIZABLE_GROUP');
const DOCUMENT_POSITION_FOLLOWING = 4;

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
  providers: [
    {
      provide: RESIZABLE_GROUP,
      useExisting: forwardRef(() => ResizablePanelGroupComponent),
    },
  ],
  host: {
    '[attr.data-slot]': '"resizable-panel-group"',
    '[attr.data-orientation]': 'orientation()',
    '[class]': 'computedClass()',
    '[style.--panel-group-size.px]': 'groupSize()',
    role: 'group',
  },
})
export class ResizablePanelGroupComponent implements ResizableGroupContext {
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
  private readonly registeredPanels = signal<ReadonlyArray<ResizablePanelApi>>([]);

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

  registerPanel(panel: ResizablePanelApi): void {
    this.registeredPanels.update((panels) => {
      if (panels.includes(panel)) {
        return panels;
      }
      return this.sortPanelsByDom([...panels, panel]);
    });
  }

  unregisterPanel(panel: ResizablePanelApi): void {
    this.registeredPanels.update((panels) => panels.filter((item) => item !== panel));
  }

  getPanels(): ReadonlyArray<ResizablePanelApi> {
    return this.registeredPanels();
  }

  /** Get total group size */
  getGroupSize(): number {
    return this.groupSize();
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
  }

  private sortPanelsByDom(panels: ResizablePanelApi[]): ResizablePanelApi[] {
    return [...panels].sort((left, right) => {
      const leftEl = left.getHostElement();
      const rightEl = right.getHostElement();

      if (leftEl === rightEl) return 0;
      if (leftEl.compareDocumentPosition(rightEl) & DOCUMENT_POSITION_FOLLOWING) {
        return -1;
      }
      return 1;
    });
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
export class ResizablePanelComponent implements ResizablePanelApi, OnDestroy {
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
  private readonly group = inject(RESIZABLE_GROUP, { optional: true });

  constructor() {
    afterNextRender(() => {
      this.group?.registerPanel(this);
      this.initializeSize();
    });
  }

  private initializeSize(): void {
    const panels = this.group?.getPanels() ?? [];
    const panelIndex = panels.indexOf(this);
    const savedSizes = this.group?.panelSizes();
    if (savedSizes && savedSizes.length > 0) {
      if (panelIndex >= 0 && panelIndex < savedSizes.length) {
        this.setSize(savedSizes[panelIndex] ?? this.defaultSize());
        this.syncGroupSizes();
        return;
      }
    }
    this.setSize(this.defaultSize());
    this.syncGroupSizes();
  }

  /** Set the panel size */
  setSize(percentage: number): void {
    const clampedSize = this.clampSize(percentage);
    this.sizePercentage.set(clampedSize);
  }

  /** Get current size */
  getSize(): number {
    return this.sizePercentage();
  }

  getDefaultSize(): number {
    return this.defaultSize();
  }

  getMinSize(): number {
    return this.minSize();
  }

  getMaxSize(): number {
    return this.maxSize();
  }

  getHostElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  ngOnDestroy(): void {
    this.group?.unregisterPanel(this);
  }

  private clampSize(size: number): number {
    return Math.max(this.minSize(), Math.min(this.maxSize(), size));
  }

  private syncGroupSizes(): void {
    const panels = this.group?.getPanels() ?? [];
    if (panels.length === 0) return;
    this.group?.updatePanelSizes(panels.map((panel) => panel.getSize()));
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
    '[attr.aria-orientation]': 'separatorOrientation()',
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
  protected readonly orientation = computed<ResizableOrientation>(
    () => this.group?.orientation() ?? 'horizontal',
  );
  protected readonly separatorOrientation = computed<'horizontal' | 'vertical'>(() =>
    this.orientation() === 'vertical' ? 'horizontal' : 'vertical',
  );

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

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly group = inject(RESIZABLE_GROUP, { optional: true });
  private isDragging = false;
  private startPos = 0;
  private startSizes: number[] = [];

  private getContainerSize(parent: HTMLElement): number {
    return this.orientation() === 'horizontal' ? parent.offsetWidth : parent.offsetHeight;
  }

  private getAdjacentPanelIndices(
    parent: HTMLElement,
  ): { prevPanelIndex: number; nextPanelIndex: number } | null {
    const children = Array.from(parent.children) as HTMLElement[];
    const handleIndex = children.indexOf(this.elementRef.nativeElement);
    if (handleIndex < 0) {
      return null;
    }

    const panels = this.group?.getPanels() ?? [];
    if (panels.length < 2) {
      return null;
    }
    const indexByElement = new Map(
      panels.map((panel, index) => [panel.getHostElement(), index] as const),
    );

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

    const prevPanelIndex = indexByElement.get(prevPanel) ?? -1;
    const nextPanelIndex = indexByElement.get(nextPanel) ?? -1;

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

    const panels = this.group?.getPanels() ?? [];
    if (panels.length < 2) return;
    this.startSizes = panels.map((panel) => panel.getSize());
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

    const panels = this.group?.getPanels() ?? [];
    const prevPanel = panels[prevPanelIndex];
    const nextPanel = panels[nextPanelIndex];
    if (!prevPanel || !nextPanel) return;

    const total = this.startSizes[prevPanelIndex] + this.startSizes[nextPanelIndex];
    let newPrevSize = this.startSizes[prevPanelIndex] + delta;
    newPrevSize = this.clamp(newPrevSize, prevPanel.getMinSize(), prevPanel.getMaxSize());
    let newNextSize = total - newPrevSize;
    if (newNextSize < nextPanel.getMinSize() || newNextSize > nextPanel.getMaxSize()) {
      newNextSize = this.clamp(newNextSize, nextPanel.getMinSize(), nextPanel.getMaxSize());
      newPrevSize = total - newNextSize;
    }
    if (newPrevSize < prevPanel.getMinSize() || newPrevSize > prevPanel.getMaxSize()) return;

    newSizes[prevPanelIndex] = newPrevSize;
    newSizes[nextPanelIndex] = newNextSize;
    this.applySizes(panels, newSizes);
  }

  private stopDragging(): void {
    this.isDragging = false;
  }

  private onKeyDown(event: KeyboardEvent): void {
    const step = event.shiftKey ? 10 : 1;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        if (this.orientation() === 'horizontal') this.resizeBy(-step);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (this.orientation() === 'vertical') this.resizeBy(-step);
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (this.orientation() === 'horizontal') this.resizeBy(step);
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (this.orientation() === 'vertical') this.resizeBy(step);
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

    const panels = this.group?.getPanels() ?? [];
    if (panels.length === 0) return;
    const prevPanel = panels[prevPanelIndex];
    const nextPanel = panels[nextPanelIndex];
    if (!prevPanel || !nextPanel) return;

    const prevSize = (this.getPanelPixels(prevPanel) / groupSize) * 100;
    const nextSize = (this.getPanelPixels(nextPanel) / groupSize) * 100;

    const newPrevSize = this.clamp(prevSize + delta, prevPanel.getMinSize(), prevPanel.getMaxSize());
    const newNextSize = this.clamp(nextSize - delta, nextPanel.getMinSize(), nextPanel.getMaxSize());

    if (newPrevSize >= prevPanel.getMinSize() && newNextSize >= nextPanel.getMinSize()) {
      const updatedSizes = panels.map((panel) => panel.getSize());
      updatedSizes[prevPanelIndex] = newPrevSize;
      updatedSizes[nextPanelIndex] = newNextSize;
      this.applySizes(panels, updatedSizes);
    }
  }

  private resetSizes(): void {
    const parent = this.elementRef.nativeElement.parentElement;
    if (!parent) return;

    const panels = this.group?.getPanels() ?? [];
    if (panels.length === 0) return;
    const equalSize = 100 / panels.length;

    this.applySizes(panels, panels.map(() => equalSize));
  }

  private getPanelPixels(panel: ResizablePanelApi): number {
    const element = panel.getHostElement();
    return this.orientation() === 'horizontal' ? element.offsetWidth : element.offsetHeight;
  }

  private applySizes(panels: ReadonlyArray<ResizablePanelApi>, sizes: number[]): void {
    panels.forEach((panel, index) => {
      panel.setSize(sizes[index] ?? panel.getSize());
    });
    this.group?.updatePanelSizes(sizes);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
}

// Export all components
export const ResizableComponents = [
  ResizablePanelGroupComponent,
  ResizablePanelComponent,
  ResizableHandleComponent,
];
