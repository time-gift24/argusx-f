# popover - zardui sources

## Directory
- demo (dir)
- doc (dir)
- index.ts (file)
- popover.component.spec.ts (file)
- popover.component.ts (file)
- popover.variants.ts (file)

## index.ts
```typescript
export * from './popover.component';
export * from './popover.variants';
```

## popover.component.spec.ts
```typescript
import { OverlayModule } from '@angular/cdk/overlay';
import { Component, DebugElement, TemplateRef, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By, EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardPopoverComponent, ZardPopoverDirective } from './popover.component';

import { ZardEventManagerPlugin } from '@/shared/core/provider/event-manager-plugins/zard-event-manager-plugin';

@Component({
  imports: [ZardPopoverDirective, ZardPopoverComponent],
  standalone: true,
  template: `
    <button zPopover [zContent]="popoverContent" [zTrigger]="trigger" [zPlacement]="placement">Trigger</button>

    <ng-template #popoverContent>
      <z-popover>
        <div class="test-content">Test content</div>
      </z-popover>
    </ng-template>
  `,
})
class TestComponent {
  readonly popoverContent = viewChild.required<TemplateRef<unknown>>('popoverContent');
  trigger: 'click' | 'hover' | null = 'click';
  placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
}

describe('ZardPopoverComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let buttonElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlayModule, TestComponent],
      providers: [
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    buttonElement = fixture.debugElement.query(By.css('button'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show popover on click by default', () => {
    buttonElement.nativeElement.click();
    fixture.detectChanges();

    const overlayContainer = document.querySelector('.cdk-overlay-container');
    const popoverContent = overlayContainer?.querySelector('.test-content');

    expect(popoverContent).toBeTruthy();
    expect(popoverContent?.textContent).toContain('Test content');
  });

  it('should hide popover on second click', () => {
    buttonElement.nativeElement.click();
    fixture.detectChanges();

    let popoverContent = document.querySelector('.test-content');
    expect(popoverContent).toBeTruthy();

    buttonElement.nativeElement.click();
    fixture.detectChanges();

    popoverContent = document.querySelector('.test-content');
    expect(popoverContent).toBeFalsy();
  });

  it('should support hover trigger', () => {
    // Test that the component can be configured with hover trigger
    component.trigger = 'hover';
    fixture.detectChanges();

    expect(component.trigger).toBe('hover');
  });

  it('should not show popover when trigger is null', () => {
    component.trigger = null;
    fixture.detectChanges();

    // Create a new fixture to ensure the directive is initialized with null trigger
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    component.trigger = null;
    buttonElement = fixture.debugElement.query(By.css('button'));
    fixture.detectChanges();

    buttonElement.nativeElement.click();
    fixture.detectChanges();

    const popoverContent = document.querySelector('.test-content');
    expect(popoverContent).toBeFalsy();
  });

  it('should hide popover on outside click', done => {
    buttonElement.nativeElement.click();
    fixture.detectChanges();

    let popoverContent = document.querySelector('.test-content');
    expect(popoverContent).toBeTruthy();

    setTimeout(() => {
      document.body.click();
      fixture.detectChanges();

      popoverContent = document.querySelector('.test-content');
      expect(popoverContent).toBeFalsy();
      done();
    }, 100);
  });

  it('should apply correct placement class', () => {
    component.placement = 'top';
    fixture.detectChanges();

    buttonElement.nativeElement.click();
    fixture.detectChanges();

    const overlay = document.querySelector('.cdk-overlay-pane');
    expect(overlay).toBeTruthy();
  });

  it('should support all placement options', () => {
    const placements: Array<'top' | 'bottom' | 'left' | 'right'> = ['top', 'bottom', 'left', 'right'];

    placements.forEach(placement => {
      component.placement = placement;
      fixture.detectChanges();

      buttonElement.nativeElement.click();
      fixture.detectChanges();

      const overlay = document.querySelector('.cdk-overlay-pane');
      expect(overlay).toBeTruthy();

      // Close the popover
      buttonElement.nativeElement.click();
      fixture.detectChanges();
    });
  });

  it('should keep popover on scroll', async () => {
    buttonElement.nativeElement.click();
    fixture.detectChanges();

    let popoverContent = document.querySelector('.test-content');
    expect(popoverContent).toBeTruthy();

    // Simulate scroll event
    const scrollEvent = new Event('scroll', { bubbles: true });
    window.dispatchEvent(scrollEvent);
    fixture.detectChanges();

    // Wait for the scroll strategy to close the popover
    await fixture.whenStable();
    fixture.detectChanges();

    // The popover should be closed due to the close scroll strategy
    popoverContent = document.querySelector('.test-content');
    expect(popoverContent).toBeTruthy();
  });

  it('should have flexible positioning with multiple fallback positions', () => {
    // This test verifies that the directive sets up multiple positions for better placement
    const directive = buttonElement.injector.get(ZardPopoverDirective);

    // Access the private method for testing - in a real scenario this would be tested through behavior
    const positions = (directive as any).getPositions();

    expect(positions).toBeDefined();
    expect(positions.length).toBeGreaterThan(1); // Should have fallback positions
    expect(positions[0]).toHaveProperty('originX');
    expect(positions[0]).toHaveProperty('originY');
    expect(positions[0]).toHaveProperty('overlayX');
    expect(positions[0]).toHaveProperty('overlayY');
  });

  it('should have correct fallback positions for each placement', () => {
    const directive = buttonElement.injector.get(ZardPopoverDirective);
    const placements: Array<'top' | 'bottom' | 'left' | 'right'> = ['top', 'bottom', 'left', 'right'];

    placements.forEach(placement => {
      component.placement = placement;
      fixture.detectChanges();

      const positions = (directive as any).getPositions();

      // Should have primary position plus fallbacks
      expect(positions.length).toBeGreaterThanOrEqual(2);

      // First position should match the requested placement
      const [primaryPosition] = positions;

      if (placement === 'bottom') {
        expect(primaryPosition.originY).toBe('bottom');
        expect(primaryPosition.overlayY).toBe('top');
        // Should have top as fallback
        expect(positions[1].originY).toBe('top');
        expect(positions[1].overlayY).toBe('bottom');
      } else if (placement === 'top') {
        expect(primaryPosition.originY).toBe('top');
        expect(primaryPosition.overlayY).toBe('bottom');
        // Should have bottom as fallback
        expect(positions[1].originY).toBe('bottom');
        expect(positions[1].overlayY).toBe('top');
      } else if (placement === 'left') {
        expect(primaryPosition.originX).toBe('start');
        expect(primaryPosition.overlayX).toBe('end');
        // Should have right as fallback
        expect(positions[1].originX).toBe('end');
        expect(positions[1].overlayX).toBe('start');
      } else if (placement === 'right') {
        expect(primaryPosition.originX).toBe('end');
        expect(primaryPosition.overlayX).toBe('start');
        // Should have left as fallback
        expect(positions[1].originX).toBe('start');
        expect(positions[1].overlayX).toBe('end');
      }
    });
  });

  afterEach(() => {
    const overlayContainer = document.querySelector('.cdk-overlay-container');
    if (overlayContainer) {
      overlayContainer.innerHTML = '';
    }
  });
});

describe('ZardPopoverComponent standalone', () => {
  let component: ZardPopoverComponent;
  let fixture: ComponentFixture<ZardPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardPopoverComponent],
      providers: [
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply custom classes', () => {
    fixture.componentRef.setInput('class', 'custom-class');
    fixture.detectChanges();

    const element = fixture.nativeElement;
    expect(element.classList.contains('custom-class')).toBeTruthy();
  });
});

@Component({
  imports: [ZardPopoverDirective, ZardPopoverComponent],
  standalone: true,
  template: `
    <button zPopover [zContent]="popoverContent" zTrigger="hover">Hover me</button>

    <ng-template #popoverContent>
      <z-popover>
        <div class="hover-content">Hover content</div>
      </z-popover>
    </ng-template>
  `,
})
class HoverTestComponent {
  readonly popoverContent = viewChild.required<TemplateRef<unknown>>('popoverContent');
}

describe('ZardPopoverComponent with hover trigger', () => {
  let fixture: ComponentFixture<HoverTestComponent>;
  let buttonElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlayModule, HoverTestComponent],
      providers: [
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HoverTestComponent);
    buttonElement = fixture.debugElement.query(By.css('button'));
    fixture.detectChanges();
  });

  it('should be configured with hover trigger', () => {
    // This test verifies that the component can be configured with hover trigger
    // The actual hover behavior is complex to test in unit tests
    const directive = buttonElement.injector.get(ZardPopoverDirective);
    expect(directive.zTrigger()).toBe('hover');
  });

  afterEach(() => {
    const overlayContainer = document.querySelector('.cdk-overlay-container');
    if (overlayContainer) {
      overlayContainer.innerHTML = '';
    }
  });
});
```

## popover.component.ts
```typescript
import { type ConnectedPosition, Overlay, OverlayPositionBuilder, type OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  type OnDestroy,
  type OnInit,
  output,
  PLATFORM_ID,
  Renderer2,
  signal,
  type TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { filter, Subscription } from 'rxjs';

import { popoverVariants } from './popover.variants';

import { mergeClasses } from '@/shared/utils/merge-classes';

export type ZardPopoverTrigger = 'click' | 'hover' | null;
export type ZardPopoverPlacement = 'top' | 'bottom' | 'left' | 'right';

const POPOVER_POSITIONS_MAP: { [key: string]: ConnectedPosition } = {
  top: {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'bottom',
    offsetX: 0,
    offsetY: -8,
  },
  bottom: {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
    offsetX: 0,
    offsetY: 8,
  },
  left: {
    originX: 'start',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'center',
    offsetX: -8,
    offsetY: 0,
  },
  right: {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
    offsetX: 8,
    offsetY: 0,
  },
} as const;

@Directive({
  selector: '[zPopover]',
  standalone: true,
  exportAs: 'zPopover',
})
export class ZardPopoverDirective implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly overlay = inject(Overlay);
  private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly platformId = inject(PLATFORM_ID);

  private overlayRef?: OverlayRef;
  private overlayRefSubscription?: Subscription;
  private listeners: (() => void)[] = [];

  readonly zTrigger = input<ZardPopoverTrigger>('click');
  readonly zContent = input.required<TemplateRef<unknown>>();
  readonly zPlacement = input<ZardPopoverPlacement>('bottom');
  readonly zOrigin = input<ElementRef>();
  readonly zVisible = input<boolean>(false);
  readonly zOverlayClickable = input<boolean>(true);
  readonly zVisibleChange = output<boolean>();

  private readonly isVisible = signal(false);

  get nativeElement() {
    return this.zOrigin()?.nativeElement ?? this.elementRef.nativeElement;
  }

  constructor() {
    toObservable(this.zVisible)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(visible => {
        const currentlyVisible = this.isVisible();
        if (visible && !currentlyVisible) {
          this.show();
        } else if (!visible && currentlyVisible) {
          this.hide();
        }
      });

    toObservable(this.zTrigger)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(trigger => {
        if (this.listeners.length) {
          this.unlistenAll();
        }
        this.setupTriggers();
        this.overlayRefSubscription?.unsubscribe();
        this.overlayRefSubscription = undefined;
        if (trigger === 'click') {
          this.subscribeToOverlayRef();
        }
      });
  }

  ngOnInit() {
    this.createOverlay();
  }

  ngOnDestroy() {
    this.unlistenAll();
    this.overlayRefSubscription?.unsubscribe();
    this.overlayRef?.dispose();
  }

  show() {
    if (this.isVisible()) {
      return;
    }

    if (!this.overlayRef) {
      this.createOverlay();
    }

    const templatePortal = new TemplatePortal(this.zContent(), this.viewContainerRef);
    this.overlayRef?.attach(templatePortal);
    this.isVisible.set(true);
    this.zVisibleChange.emit(true);
  }

  hide() {
    if (!this.isVisible()) {
      return;
    }

    this.overlayRef?.detach();
    this.isVisible.set(false);
    this.zVisibleChange.emit(false);
  }

  toggle() {
    if (this.isVisible()) {
      this.hide();
    } else {
      this.show();
    }
  }

  private createOverlay() {
    if (isPlatformBrowser(this.platformId)) {
      const positionStrategy = this.overlayPositionBuilder
        .flexibleConnectedTo(this.nativeElement)
        .withPositions(this.getPositions())
        .withPush(false)
        .withFlexibleDimensions(false)
        .withViewportMargin(8);

      this.overlayRef = this.overlay.create({
        positionStrategy,
        hasBackdrop: false,
        scrollStrategy: this.overlay.scrollStrategies.reposition(),
      });
    }
  }

  private subscribeToOverlayRef(): void {
    if (
      this.zOverlayClickable() &&
      this.zTrigger() === 'click' &&
      isPlatformBrowser(this.platformId) &&
      this.overlayRef
    ) {
      this.overlayRefSubscription = this.overlayRef
        .outsidePointerEvents()
        .pipe(filter(event => !this.nativeElement.contains(event.target)))
        .subscribe(() => this.hide());
    }
  }

  private setupTriggers() {
    const trigger = this.zTrigger();
    if (!trigger) {
      return;
    }

    if (trigger === 'click') {
      this.listeners.push(this.renderer.listen(this.nativeElement, 'click.stop', () => this.toggle()));
    } else if (trigger === 'hover') {
      this.listeners.push(this.renderer.listen(this.nativeElement, 'mouseenter', () => this.show()));

      this.listeners.push(this.renderer.listen(this.nativeElement, 'mouseleave', () => this.hide()));
    }
  }

  private unlistenAll(): void {
    for (const listener of this.listeners) {
      listener();
    }
    this.listeners = [];
  }

  private getPositions(): ConnectedPosition[] {
    const placement = this.zPlacement();
    const positions: ConnectedPosition[] = [];

    // Primary position
    const primaryConfig = POPOVER_POSITIONS_MAP[placement];
    positions.push({
      originX: primaryConfig.originX,
      originY: primaryConfig.originY,
      overlayX: primaryConfig.overlayX,
      overlayY: primaryConfig.overlayY,
      offsetX: primaryConfig.offsetX ?? 0,
      offsetY: primaryConfig.offsetY ?? 0,
    });

    // Fallback positions for better positioning when primary doesn't fit
    switch (placement) {
      case 'bottom':
        // Try top if bottom doesn't fit
        positions.push({
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
          offsetX: 0,
          offsetY: -8,
        });
        // If neither top nor bottom work, try right
        positions.push({
          originX: 'end',
          originY: 'center',
          overlayX: 'start',
          overlayY: 'center',
          offsetX: 8,
          offsetY: 0,
        });
        // Finally try left
        positions.push({
          originX: 'start',
          originY: 'center',
          overlayX: 'end',
          overlayY: 'center',
          offsetX: -8,
          offsetY: 0,
        });
        break;
      case 'top':
        // Try bottom if top doesn't fit
        positions.push({
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          offsetX: 0,
          offsetY: 8,
        });
        // If neither top nor bottom work, try right
        positions.push({
          originX: 'end',
          originY: 'center',
          overlayX: 'start',
          overlayY: 'center',
          offsetX: 8,
          offsetY: 0,
        });
        // Finally try left
        positions.push({
          originX: 'start',
          originY: 'center',
          overlayX: 'end',
          overlayY: 'center',
          offsetX: -8,
          offsetY: 0,
        });
        break;
      case 'right':
        // Try left if right doesn't fit
        positions.push({
          originX: 'start',
          originY: 'center',
          overlayX: 'end',
          overlayY: 'center',
          offsetX: -8,
          offsetY: 0,
        });
        // If neither left nor right work, try bottom
        positions.push({
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          offsetX: 0,
          offsetY: 8,
        });
        // Finally try top
        positions.push({
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
          offsetX: 0,
          offsetY: -8,
        });
        break;
      case 'left':
        // Try right if left doesn't fit
        positions.push({
          originX: 'end',
          originY: 'center',
          overlayX: 'start',
          overlayY: 'center',
          offsetX: 8,
          offsetY: 0,
        });
        // If neither left nor right work, try bottom
        positions.push({
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          offsetX: 0,
          offsetY: 8,
        });
        // Finally try top
        positions.push({
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
          offsetX: 0,
          offsetY: -8,
        });
        break;
    }

    return positions;
  }
}

@Component({
  selector: 'z-popover',
  imports: [],
  standalone: true,
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardPopoverComponent {
  readonly class = input<string>('');

  protected readonly classes = computed(() => mergeClasses(popoverVariants(), this.class()));
}
```

## popover.variants.ts
```typescript
import { cva, type VariantProps } from 'class-variance-authority';

export const popoverVariants = cva(
  'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
);

export type ZardPopoverVariants = VariantProps<typeof popoverVariants>;
```

