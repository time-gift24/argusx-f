# resizable - zardui sources

## Directory
- demo (dir)
- doc (dir)
- index.ts (file)
- resizable-handle.component.spec.ts (file)
- resizable-handle.component.ts (file)
- resizable-panel.component.spec.ts (file)
- resizable-panel.component.ts (file)
- resizable.component.spec.ts (file)
- resizable.component.ts (file)
- resizable.imports.ts (file)
- resizable.variants.ts (file)

## index.ts
```typescript
export * from '@/shared/components/resizable/resizable.component';
export * from '@/shared/components/resizable/resizable-panel.component';
export * from '@/shared/components/resizable/resizable-handle.component';
export * from '@/shared/components/resizable/resizable.imports';
export * from '@/shared/components/resizable/resizable.variants';
```

## resizable-handle.component.spec.ts
```typescript
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By, EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardResizableHandleComponent } from './resizable-handle.component';
import { ZardResizablePanelComponent } from './resizable-panel.component';
import { ZardResizableComponent } from './resizable.component';

import { ZardEventManagerPlugin } from '@/shared/core/provider/event-manager-plugins/zard-event-manager-plugin';

@Component({
  selector: 'test-handle-host',
  imports: [ZardResizableComponent, ZardResizablePanelComponent, ZardResizableHandleComponent],
  standalone: true,
  template: `
    <z-resizable [zLayout]="layout">
      <z-resizable-panel [zCollapsible]="panel1Collapsible">Panel 1</z-resizable-panel>
      <z-resizable-handle
        [zHandleIndex]="handleIndex"
        [zWithHandle]="withHandle"
        [zDisabled]="disabled"
        [class]="customClass"
      />
      <z-resizable-panel [zCollapsible]="panel2Collapsible">Panel 2</z-resizable-panel>
    </z-resizable>
  `,
})
class TestHandleHostComponent {
  layout: 'horizontal' | 'vertical' = 'horizontal';
  handleIndex = 0;
  withHandle = true;
  disabled = false;
  customClass = '';
  panel1Collapsible = false;
  panel2Collapsible = false;
}

@Component({
  selector: 'test-standalone-handle',
  imports: [ZardResizableHandleComponent],
  standalone: true,
  template: `
    <z-resizable-handle [zHandleIndex]="0" [zWithHandle]="true" [zDisabled]="false" />
  `,
})
class TestStandaloneHandleComponent {}

describe('ZardResizableHandleComponent', () => {
  let fixture: ComponentFixture<TestHandleHostComponent>;
  let hostComponent: TestHandleHostComponent;
  let handleComponent: ZardResizableHandleComponent;
  let handleElement: HTMLElement;
  let resizableComponent: ZardResizableComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHandleHostComponent],
      providers: [
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHandleHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();

    handleComponent = fixture.debugElement.query(By.directive(ZardResizableHandleComponent)).componentInstance;
    handleElement = fixture.debugElement.query(By.directive(ZardResizableHandleComponent)).nativeElement;
    resizableComponent = fixture.debugElement.query(By.directive(ZardResizableComponent)).componentInstance;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(handleComponent).toBeTruthy();
    });

    it('should inject resizable component', () => {
      expect(handleComponent['resizable']).toBe(resizableComponent);
    });

    it('should have exportAs property', () => {
      const debugElement = fixture.debugElement.query(By.directive(ZardResizableHandleComponent));
      expect(debugElement.componentInstance).toBeTruthy();
    });
  });

  describe('Input Properties', () => {
    it('should set handle index', () => {
      expect(handleComponent.zHandleIndex()).toBe(0);

      hostComponent.handleIndex = 1;
      fixture.detectChanges();
      expect(handleComponent.zHandleIndex()).toBe(1);
    });

    it('should set with handle property', () => {
      expect(handleComponent.zWithHandle()).toBe(true);

      hostComponent.withHandle = false;
      fixture.detectChanges();
      expect(handleComponent.zWithHandle()).toBe(false);
    });

    it('should set disabled property', () => {
      expect(handleComponent.zDisabled()).toBe(false);

      hostComponent.disabled = true;
      fixture.detectChanges();
      expect(handleComponent.zDisabled()).toBe(true);
    });

    it('should handle transform inputs correctly', () => {
      // Test boolean transform for withHandle (empty string = true)
      hostComponent.withHandle = '' as any;
      fixture.detectChanges();
      expect(handleComponent.zWithHandle()).toBe(true);

      hostComponent.withHandle = 'false' as any;
      fixture.detectChanges();
      expect(handleComponent.zWithHandle()).toBe(false);

      // Test boolean transform for disabled
      hostComponent.disabled = '' as any;
      fixture.detectChanges();
      expect(handleComponent.zDisabled()).toBe(true);

      hostComponent.disabled = 'false' as any;
      fixture.detectChanges();
      expect(handleComponent.zDisabled()).toBe(false);
    });
  });

  describe('Layout Detection', () => {
    it('should detect horizontal layout from parent', () => {
      expect(handleElement.getAttribute('data-layout')).toBe('horizontal');
    });

    it('should detect vertical layout from parent', () => {
      hostComponent.layout = 'vertical';
      fixture.detectChanges();
      expect(handleElement.getAttribute('data-layout')).toBe('vertical');
    });

    it('should default to horizontal when no parent resizable', () => {
      const standaloneFixture = TestBed.createComponent(TestStandaloneHandleComponent);
      standaloneFixture.detectChanges();

      const standaloneElement = standaloneFixture.debugElement.query(
        By.directive(ZardResizableHandleComponent),
      ).nativeElement;
      expect(standaloneElement.getAttribute('data-layout')).toBe('horizontal');
    });
  });

  describe('Host Attributes', () => {
    it('should set data-layout attribute', () => {
      expect(handleElement.getAttribute('data-layout')).toBe('horizontal');

      hostComponent.layout = 'vertical';
      fixture.detectChanges();
      expect(handleElement.getAttribute('data-layout')).toBe('vertical');
    });

    it('should set tabindex when not disabled', () => {
      expect(handleElement.getAttribute('tabindex')).toBe('0');
    });

    it('should remove tabindex when disabled', () => {
      hostComponent.disabled = true;
      fixture.detectChanges();
      expect(handleElement.getAttribute('tabindex')).toBeNull();
    });

    it('should set role attribute', () => {
      expect(handleElement.getAttribute('role')).toBe('separator');
    });

    it('should set aria-orientation for horizontal layout', () => {
      expect(handleElement.getAttribute('aria-orientation')).toBe('vertical');
    });

    it('should set aria-orientation for vertical layout', () => {
      hostComponent.layout = 'vertical';
      fixture.detectChanges();
      expect(handleElement.getAttribute('aria-orientation')).toBe('horizontal');
    });

    it('should set aria-disabled when disabled', () => {
      expect(handleElement.getAttribute('aria-disabled')).toBe('false');

      hostComponent.disabled = true;
      fixture.detectChanges();
      expect(handleElement.getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('CSS Classes', () => {
    it('should apply default CSS classes for horizontal layout', () => {
      expect(handleElement.classList).toContain('group');
      expect(handleElement.classList).toContain('relative');
      expect(handleElement.classList).toContain('flex');
      expect(handleElement.classList).toContain('cursor-col-resize');
    });

    it('should apply CSS classes for vertical layout', () => {
      hostComponent.layout = 'vertical';
      fixture.detectChanges();

      expect(handleElement.classList).toContain('group');
      expect(handleElement.classList).toContain('relative');
      expect(handleElement.classList).toContain('flex');
      expect(handleElement.classList).toContain('cursor-row-resize');
    });

    it('should apply disabled CSS classes', () => {
      hostComponent.disabled = true;
      fixture.detectChanges();

      expect(handleElement.classList).toContain('cursor-default');
      expect(handleElement.classList).toContain('pointer-events-none');
      expect(handleElement.classList).toContain('opacity-50');
    });

    it('should apply custom CSS classes', () => {
      hostComponent.customClass = 'custom-handle-class';
      fixture.detectChanges();

      expect(handleElement.classList).toContain('custom-handle-class');
    });
  });

  describe('Handle Indicator', () => {
    it('should render handle indicator when withHandle is true', () => {
      const indicator = handleElement.querySelector('div');
      expect(indicator).toBeTruthy();
    });

    it('should not render handle indicator when withHandle is false', () => {
      hostComponent.withHandle = false;
      fixture.detectChanges();

      const indicator = handleElement.querySelector('div');
      expect(indicator).toBeFalsy();
    });

    it('should apply correct indicator classes for horizontal layout', () => {
      const indicator = handleElement.querySelector('div');
      expect(indicator?.classList).toContain('w-px');
      expect(indicator?.classList).toContain('h-8');
    });

    it('should apply correct indicator classes for vertical layout', () => {
      hostComponent.layout = 'vertical';
      fixture.detectChanges();

      const indicator = handleElement.querySelector('div');
      expect(indicator?.classList).toContain('w-8');
      expect(indicator?.classList).toContain('h-px');
    });
  });

  describe('Mouse Events', () => {
    beforeEach(() => {
      jest.spyOn(resizableComponent, 'startResize');
    });

    it('should handle mouse down event', () => {
      const mouseEvent = new MouseEvent('mousedown', { clientX: 100 });
      handleElement.dispatchEvent(mouseEvent);

      expect(resizableComponent.startResize).toHaveBeenCalledWith(0, mouseEvent);
    });

    it('should not handle mouse down when disabled', () => {
      hostComponent.disabled = true;
      fixture.detectChanges();

      const mouseEvent = new MouseEvent('mousedown', { clientX: 100 });
      handleElement.dispatchEvent(mouseEvent);

      expect(resizableComponent.startResize).not.toHaveBeenCalled();
    });

    it('should not handle mouse down when no resizable parent', () => {
      const standaloneFixture = TestBed.createComponent(TestStandaloneHandleComponent);
      standaloneFixture.detectChanges();

      const standaloneElement = standaloneFixture.debugElement.query(
        By.directive(ZardResizableHandleComponent),
      ).nativeElement;
      const mouseEvent = new MouseEvent('mousedown', { clientX: 100 });

      expect(() => {
        standaloneElement.dispatchEvent(mouseEvent);
      }).not.toThrow();
    });
  });

  describe('Touch Events', () => {
    beforeEach(() => {
      jest.spyOn(resizableComponent, 'startResize');
    });

    it('should handle touch start event', () => {
      const touchMock = { clientX: 500, clientY: 300 } as Touch;
      const listMock: TouchList = { length: 1, item: (index: number) => touchMock, 0: touchMock };
      const touchEvent = new TouchEvent('touchstart', {
        touches: listMock as unknown as Touch[],
      });

      handleElement.dispatchEvent(touchEvent);

      expect(resizableComponent.startResize).toHaveBeenCalledWith(0, touchEvent);
    });

    it('should not handle touch start when disabled', () => {
      hostComponent.disabled = true;
      fixture.detectChanges();

      const touchEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 50 } as Touch],
      });
      handleElement.dispatchEvent(touchEvent);

      expect(resizableComponent.startResize).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Events', () => {
    beforeEach(() => {
      jest.spyOn(resizableComponent, 'collapsePanel');
    });

    it('should handle arrow keys for horizontal layout', () => {
      const rightArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true });

      handleElement.dispatchEvent(rightArrowEvent);

      expect(rightArrowEvent.defaultPrevented).toBe(true);
    });

    it('should handle arrow keys for vertical layout', () => {
      hostComponent.layout = 'vertical';
      fixture.detectChanges();

      const downArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true });
      handleElement.dispatchEvent(downArrowEvent);

      expect(downArrowEvent.defaultPrevented).toBe(true);
    });

    it('should handle Shift+Arrow for larger steps', () => {
      const shiftRightEvent = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        shiftKey: true,
        cancelable: true,
      });

      handleElement.dispatchEvent(shiftRightEvent);

      expect(shiftRightEvent.defaultPrevented).toBe(true);
    });

    it('should handle Home key', () => {
      const homeEvent = new KeyboardEvent('keydown', { key: 'Home', cancelable: true });

      handleElement.dispatchEvent(homeEvent);

      expect(homeEvent.defaultPrevented).toBe(true);
    });

    it('should handle End key', () => {
      const endEvent = new KeyboardEvent('keydown', { key: 'End', cancelable: true });

      handleElement.dispatchEvent(endEvent);

      expect(endEvent.defaultPrevented).toBe(true);
    });

    it('should handle Enter/Space for collapsible panels', () => {
      hostComponent.panel1Collapsible = true;
      fixture.detectChanges();

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });

      handleElement.dispatchEvent(enterEvent);

      expect(enterEvent.defaultPrevented).toBe(true);
      expect(resizableComponent.collapsePanel).toHaveBeenCalledWith(0);
    });

    it('should handle Space for collapsible panels', () => {
      hostComponent.panel2Collapsible = true;
      fixture.detectChanges();

      const spaceEvent = new KeyboardEvent('keydown', { key: ' ', cancelable: true });

      handleElement.dispatchEvent(spaceEvent);

      expect(spaceEvent.defaultPrevented).toBe(true);
      expect(resizableComponent.collapsePanel).toHaveBeenCalledWith(1);
    });

    it('should ignore unsupported keys', () => {
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
      handleElement.dispatchEvent(tabEvent);

      expect(tabEvent.defaultPrevented).toBe(false);
    });

    it('should not handle keyboard events when disabled', () => {
      hostComponent.disabled = true;
      fixture.detectChanges();

      const rightArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true });
      handleElement.dispatchEvent(rightArrowEvent);

      expect(rightArrowEvent.defaultPrevented).toBe(false);
    });

    it('should not handle keyboard events when no resizable parent', () => {
      const standaloneFixture = TestBed.createComponent(TestStandaloneHandleComponent);
      standaloneFixture.detectChanges();

      const standaloneHandle = standaloneFixture.debugElement.query(
        By.directive(ZardResizableHandleComponent),
      ).nativeElement;
      const rightArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true });
      jest.spyOn(handleComponent as any, 'adjustSizes');

      expect(() => {
        standaloneHandle.dispatchEvent(rightArrowEvent);
      }).not.toThrow();
      expect(standaloneHandle['resizable']).toBeUndefined();
      expect(handleComponent['adjustSizes']).not.toHaveBeenCalled();
    });
  });

  describe('Private Methods', () => {
    it('should call adjustSizes method when arrow keys are pressed', () => {
      const spy = jest.spyOn(handleComponent as any, 'adjustSizes');

      const rightArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      handleElement.dispatchEvent(rightArrowEvent);

      expect(spy).toHaveBeenCalledWith(1);
    });

    it('should call moveToExtreme method for Home/End keys', () => {
      const spy = jest.spyOn(handleComponent as any, 'moveToExtreme');

      const homeEvent = new KeyboardEvent('keydown', { key: 'Home' });
      handleElement.dispatchEvent(homeEvent);

      expect(spy).toHaveBeenCalledWith(true);

      const endEvent = new KeyboardEvent('keydown', { key: 'End' });
      handleElement.dispatchEvent(endEvent);

      expect(spy).toHaveBeenCalledWith(false);
    });
  });

  describe('Default Values', () => {
    let defaultComponent: ZardResizableHandleComponent;

    beforeEach(() => {
      const defaultFixture = TestBed.createComponent(ZardResizableHandleComponent);
      defaultComponent = defaultFixture.componentInstance;
      defaultFixture.detectChanges();
    });

    it('should have correct default values', () => {
      expect(defaultComponent.zWithHandle()).toBe(false);
      expect(defaultComponent.zDisabled()).toBe(false);
      expect(defaultComponent.zHandleIndex()).toBe(0);
      expect(defaultComponent.class()).toBe('');
    });
  });
});
```

## resizable-handle.component.ts
```typescript
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardResizableComponent } from '@/shared/components/resizable/resizable.component';
import {
  resizableHandleIndicatorVariants,
  resizableHandleVariants,
} from '@/shared/components/resizable/resizable.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-resizable-handle, [z-resizable-handle]',
  template: `
    @if (zWithHandle()) {
      <div [class]="handleClasses()"></div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'separator',
    '[class]': 'classes()',
    '[attr.data-layout]': 'layout()',
    '[attr.tabindex]': 'zDisabled() ? null : 0',
    '[attr.aria-orientation]': 'layout() === "vertical" ? "horizontal" : "vertical"',
    '[attr.aria-disabled]': 'zDisabled()',
    '(mousedown)': 'handleMouseDown($event)',
    '(touchstart)': 'handleTouchStart($event)',
    '(keydown.{arrowleft,arrowright,arrowup,arrowdown,home,end,enter,space}.prevent)': 'handleKeyDown($event)',
  },
  exportAs: 'zResizableHandle',
})
export class ZardResizableHandleComponent {
  private readonly resizable = inject(ZardResizableComponent, { optional: true });

  readonly zWithHandle = input(false, { transform: booleanAttribute });
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zHandleIndex = input<number>(0);
  readonly class = input<ClassValue>('');

  protected readonly layout = computed(() => this.resizable?.zLayout() ?? 'horizontal');

  protected readonly classes = computed(() =>
    mergeClasses(
      resizableHandleVariants({
        zLayout: this.layout(),
        zDisabled: this.zDisabled(),
      }),
      this.class(),
    ),
  );

  protected readonly handleClasses = computed(() => resizableHandleIndicatorVariants({ zLayout: this.layout() }));

  handleMouseDown(event: MouseEvent): void {
    if (this.zDisabled() || !this.resizable) {
      return;
    }
    this.resizable.startResize(this.zHandleIndex(), event);
  }

  handleTouchStart(event: TouchEvent): void {
    if (this.zDisabled() || !this.resizable) {
      return;
    }
    this.resizable.startResize(this.zHandleIndex(), event);
  }

  handleKeyDown(event: Event): void {
    if (this.zDisabled() || !this.resizable) {
      return;
    }
    const { key, shiftKey } = event as KeyboardEvent;

    const panels = this.resizable.panels();
    const handleIndex = this.zHandleIndex();
    const layout = this.layout();

    let delta = 0;
    const step = shiftKey ? 10 : 1;

    switch (key) {
      case 'ArrowLeft':
        if (layout === 'horizontal') {
          delta = -step;
        }
        break;
      case 'ArrowRight':
        if (layout === 'horizontal') {
          delta = step;
        }
        break;
      case 'ArrowUp':
        if (layout === 'vertical') {
          delta = -step;
        }
        break;
      case 'ArrowDown':
        if (layout === 'vertical') {
          delta = step;
        }
        break;
      case 'Home':
        this.moveToExtreme(true);
        break;
      case 'End':
        this.moveToExtreme(false);
        break;
      case 'Enter':
      case ' ':
        if (panels[handleIndex]?.zCollapsible() || panels[handleIndex + 1]?.zCollapsible()) {
          const collapsibleIndex = panels[handleIndex]?.zCollapsible() ? handleIndex : handleIndex + 1;
          this.resizable.collapsePanel(collapsibleIndex);
        }
        break;
      default:
        break;
    }

    if (delta !== 0) {
      this.adjustSizes(delta);
    }
  }

  private adjustSizes(delta: number): void {
    if (!this.resizable) {
      return;
    }

    const panels = this.resizable.panels();
    const handleIndex = this.zHandleIndex();
    const sizes = [...this.resizable.panelSizes()];

    const leftPanel = panels[handleIndex];
    const rightPanel = panels[handleIndex + 1];

    if (!leftPanel || !rightPanel) {
      return;
    }

    const containerSize = this.resizable.getContainerSize();
    const { leftMin, leftMax, rightMin, rightMax } = this.normalizeMinMax(
      this.resizable.convertToPercentage(leftPanel.zMin(), containerSize),
      this.resizable.convertToPercentage(leftPanel.zMax(), containerSize),
      this.resizable.convertToPercentage(rightPanel.zMin(), containerSize),
      this.resizable.convertToPercentage(rightPanel.zMax(), containerSize),
    );

    let newLeftSize = sizes[handleIndex] + delta;
    let newRightSize = sizes[handleIndex + 1] - delta;

    newLeftSize = Math.max(leftMin, Math.min(leftMax, newLeftSize));
    newRightSize = Math.max(rightMin, Math.min(rightMax, newRightSize));

    const totalSize = newLeftSize + newRightSize;
    const originalTotal = sizes[handleIndex] + sizes[handleIndex + 1];

    if (Math.abs(totalSize - originalTotal) < 0.01) {
      sizes[handleIndex] = newLeftSize;
      sizes[handleIndex + 1] = newRightSize;

      this.resizable.panelSizes.set(sizes);
      this.resizable.updatePanelStyles();
      this.resizable.zResize.emit({
        sizes,
        layout: this.resizable.zLayout() ?? 'horizontal',
      });
    }
  }

  private moveToExtreme(toMin: boolean): void {
    if (!this.resizable) {
      return;
    }

    const panels = this.resizable.panels();
    const handleIndex = this.zHandleIndex();
    const sizes = [...this.resizable.panelSizes()];

    const leftPanel = panels[handleIndex];
    const rightPanel = panels[handleIndex + 1];

    if (!leftPanel || !rightPanel) {
      return;
    }

    const containerSize = this.resizable.getContainerSize();
    const { leftMin, leftMax, rightMin, rightMax } = this.normalizeMinMax(
      this.resizable.convertToPercentage(leftPanel.zMin(), containerSize),
      this.resizable.convertToPercentage(leftPanel.zMax(), containerSize),
      this.resizable.convertToPercentage(rightPanel.zMin(), containerSize),
      this.resizable.convertToPercentage(rightPanel.zMax(), containerSize),
    );

    const totalSize = sizes[handleIndex] + sizes[handleIndex + 1];

    if (toMin) {
      sizes[handleIndex] = leftMin;
      sizes[handleIndex + 1] = Math.min(totalSize - leftMin, rightMax);
    } else {
      sizes[handleIndex] = Math.min(totalSize - rightMin, leftMax);
      sizes[handleIndex + 1] = rightMin;
    }

    this.resizable.panelSizes.set(sizes);
    this.resizable.updatePanelStyles();
    this.resizable.zResize.emit({
      sizes,
      layout: this.resizable.zLayout() ?? 'horizontal',
    });
  }

  private normalizeMinMax(
    leftMin: number,
    leftMax: number,
    rightMin: number,
    rightMax: number,
  ): { leftMin: number; leftMax: number; rightMin: number; rightMax: number } {
    if (leftMax < leftMin) {
      const temp = leftMax;
      leftMax = leftMin;
      leftMin = temp;
    }

    if (rightMax < rightMin) {
      const temp = rightMax;
      rightMax = rightMin;
      rightMin = temp;
    }

    return { leftMin, leftMax, rightMin, rightMax };
  }
}
```

## resizable-panel.component.spec.ts
```typescript
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ZardResizablePanelComponent } from './resizable-panel.component';

@Component({
  selector: 'test-panel-host',
  imports: [ZardResizablePanelComponent],
  standalone: true,
  template: `
    <z-resizable-panel
      [zDefaultSize]="defaultSize"
      [zMin]="min"
      [zMax]="max"
      [zCollapsible]="collapsible"
      [zResizable]="resizable"
      [class]="customClass"
    >
      <div>Panel Content</div>
    </z-resizable-panel>
  `,
})
class TestPanelHostComponent {
  defaultSize: number | string | undefined = 50;
  min: number | string = 10;
  max: number | string = 90;
  collapsible = false;
  resizable = true;
  customClass = '';
}

describe('ZardResizablePanelComponent', () => {
  let fixture: ComponentFixture<TestPanelHostComponent>;
  let hostComponent: TestPanelHostComponent;
  let panelComponent: ZardResizablePanelComponent;
  let panelElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestPanelHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestPanelHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();

    panelComponent = fixture.debugElement.query(By.directive(ZardResizablePanelComponent)).componentInstance;
    panelElement = fixture.debugElement.query(By.directive(ZardResizablePanelComponent)).nativeElement;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(panelComponent).toBeTruthy();
    });

    it('should render panel content', () => {
      const content = panelElement.textContent?.trim();
      expect(content).toBe('Panel Content');
    });

    it('should have exportAs property', () => {
      const debugElement = fixture.debugElement.query(By.directive(ZardResizablePanelComponent));
      expect(debugElement.componentInstance).toBeTruthy();
    });
  });

  describe('Input Properties', () => {
    it('should set default size', () => {
      expect(panelComponent.zDefaultSize()).toBe(50);
    });

    it('should handle undefined default size', () => {
      hostComponent.defaultSize = undefined;
      fixture.detectChanges();
      expect(panelComponent.zDefaultSize()).toBeUndefined();
    });

    it('should handle string default size', () => {
      hostComponent.defaultSize = '60%';
      fixture.detectChanges();
      expect(panelComponent.zDefaultSize()).toBe('60%');
    });

    it('should set min value', () => {
      expect(panelComponent.zMin()).toBe(10);
    });

    it('should set max value', () => {
      expect(panelComponent.zMax()).toBe(90);
    });

    it('should handle string min/max values', () => {
      hostComponent.min = '15%';
      hostComponent.max = '85%';
      fixture.detectChanges();

      expect(panelComponent.zMin()).toBe('15%');
      expect(panelComponent.zMax()).toBe('85%');
    });

    it('should set collapsible property', () => {
      expect(panelComponent.zCollapsible()).toBe(false);

      hostComponent.collapsible = true;
      fixture.detectChanges();
      expect(panelComponent.zCollapsible()).toBe(true);
    });

    it('should set resizable property', () => {
      expect(panelComponent.zResizable()).toBe(true);

      hostComponent.resizable = false;
      fixture.detectChanges();
      expect(panelComponent.zResizable()).toBe(false);
    });

    it('should handle transform inputs correctly', () => {
      // Test boolean transform for collapsible (empty string = true)
      hostComponent.collapsible = '' as any;
      fixture.detectChanges();
      expect(panelComponent.zCollapsible()).toBe(true);

      hostComponent.collapsible = 'false' as any;
      fixture.detectChanges();
      expect(panelComponent.zCollapsible()).toBe(false);

      // Test boolean transform for resizable
      hostComponent.resizable = '' as any;
      fixture.detectChanges();
      expect(panelComponent.zResizable()).toBe(true);

      hostComponent.resizable = 'false' as any;
      fixture.detectChanges();
      expect(panelComponent.zResizable()).toBe(false);
    });
  });

  describe('CSS Classes', () => {
    it('should apply default CSS classes', () => {
      expect(panelElement.classList).toContain('relative');
      expect(panelElement.classList).toContain('overflow-hidden');
      expect(panelElement.classList).toContain('shrink-0');
      expect(panelElement.classList).toContain('h-full');
    });

    it('should apply custom CSS classes', () => {
      hostComponent.customClass = 'custom-panel-class';
      fixture.detectChanges();

      expect(panelElement.classList).toContain('custom-panel-class');
    });

    it('should merge custom classes with default classes', () => {
      hostComponent.customClass = 'bg-red-500 p-4';
      fixture.detectChanges();

      expect(panelElement.classList).toContain('relative');
      expect(panelElement.classList).toContain('shrink-0');
      expect(panelElement.classList).toContain('bg-red-500');
      expect(panelElement.classList).toContain('p-4');
    });
  });

  describe('Collapsed State', () => {
    it('should detect collapsed state when width is 0', () => {
      panelElement.style.width = '0%';
      panelElement.style.height = '100%';
      fixture.detectChanges();

      expect(panelElement.getAttribute('data-collapsed')).toBe('true');
    });

    it('should detect collapsed state when height is 0', () => {
      panelElement.style.width = '100%';
      panelElement.style.height = '0%';
      fixture.detectChanges();

      expect(panelElement.getAttribute('data-collapsed')).toBe('true');
    });

    it('should set data-collapsed attribute when width is 0', () => {
      panelElement.style.width = '0px';
      fixture.detectChanges();

      expect(panelElement.getAttribute('data-collapsed')).toBe('true');
    });

    it('should set data-collapsed attribute when height is 0', () => {
      panelElement.style.height = '0px';
      fixture.detectChanges();

      expect(panelElement.getAttribute('data-collapsed')).toBe('true');
    });

    it('should apply collapsed variant classes when collapsed', () => {
      panelElement.style.width = '0%';
      fixture.detectChanges();

      // The collapsed variant class should be applied
      expect(panelElement.classList).toContain('hidden');
    });
  });

  describe('ElementRef', () => {
    it('should expose elementRef', () => {
      expect(panelComponent.elementRef).toBeDefined();
      expect(panelComponent.elementRef.nativeElement).toBe(panelElement);
    });
  });

  describe('Host Bindings', () => {
    it('should bind classes to host element', () => {
      expect(panelElement.getAttribute('class')).toContain('shrink-0');
    });

    it('should bind data-collapsed attribute to host element', () => {
      panelElement.style.width = '0%';
      fixture.detectChanges();

      expect(panelElement.getAttribute('data-collapsed')).toBe('true');
    });
  });

  describe('Content Projection', () => {
    it('should project content correctly', () => {
      const projectedContent = panelElement.querySelector('div');
      expect(projectedContent).toBeTruthy();
      expect(projectedContent?.textContent?.trim()).toBe('Panel Content');
    });

    it('should handle complex projected content', () => {
      const complexHostComponent = TestBed.createComponent(ComplexContentHostComponent);
      complexHostComponent.detectChanges();

      const complexPanelElement = complexHostComponent.debugElement.query(
        By.directive(ZardResizablePanelComponent),
      ).nativeElement;

      expect(complexPanelElement.querySelector('h2')).toBeTruthy();
      expect(complexPanelElement.querySelector('p')).toBeTruthy();
      expect(complexPanelElement.querySelector('button')).toBeTruthy();
    });
  });

  describe('Default Values', () => {
    let defaultComponent: ZardResizablePanelComponent;

    beforeEach(() => {
      const defaultFixture = TestBed.createComponent(ZardResizablePanelComponent);
      defaultComponent = defaultFixture.componentInstance;
      defaultFixture.detectChanges();
    });

    it('should have correct default values', () => {
      expect(defaultComponent.zDefaultSize()).toBeUndefined();
      expect(defaultComponent.zMin()).toBe(0);
      expect(defaultComponent.zMax()).toBe(100);
      expect(defaultComponent.zCollapsible()).toBe(false);
      expect(defaultComponent.zResizable()).toBe(true);
      expect(defaultComponent.class()).toBe('');
    });
  });
});

@Component({
  selector: 'test-complex-content-host',
  imports: [ZardResizablePanelComponent],
  standalone: true,
  template: `
    <z-resizable-panel>
      <h2>Panel Title</h2>
      <p>Panel description with some text content.</p>
      <button type="button">Action Button</button>
    </z-resizable-panel>
  `,
})
class ComplexContentHostComponent {}
```

## resizable-panel.component.ts
```typescript
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { resizablePanelVariants } from '@/shared/components/resizable/resizable.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-resizable-panel',
  standalone: true,
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    '[attr.data-collapsed]': 'isCollapsed()',
  },
  exportAs: 'zResizablePanel',
})
export class ZardResizablePanelComponent {
  readonly elementRef = inject(ElementRef);

  readonly zDefaultSize = input<number | string | undefined>(undefined);
  readonly zMin = input<number | string>(0);
  readonly zMax = input<number | string>(100);
  readonly zCollapsible = input(false, { transform: booleanAttribute });
  readonly zResizable = input(true, { transform: booleanAttribute });
  readonly class = input<ClassValue>('');

  protected readonly isCollapsed = computed(() => {
    const element = this.elementRef.nativeElement as HTMLElement;
    const width = Number.parseFloat(element.style.width || '0');
    const height = Number.parseFloat(element.style.height || '0');
    return width === 0 || height === 0;
  });

  protected readonly classes = computed(() =>
    mergeClasses(resizablePanelVariants({ zCollapsed: this.isCollapsed() }), this.class()),
  );
}
```

## resizable.component.spec.ts
```typescript
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By, EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardResizableHandleComponent } from './resizable-handle.component';
import { ZardResizablePanelComponent } from './resizable-panel.component';
import { ZardResizableComponent, ZardResizeEvent } from './resizable.component';

import { ZardEventManagerPlugin } from '@/shared/core/provider/event-manager-plugins/zard-event-manager-plugin';

@Component({
  selector: 'test-resizable-host',
  imports: [ZardResizableComponent, ZardResizablePanelComponent, ZardResizableHandleComponent],
  standalone: true,
  template: `
    <z-resizable
      [zLayout]="layout"
      [zLazy]="lazy"
      (zResizeStart)="onResizeStart($event)"
      (zResize)="onResize($event)"
      (zResizeEnd)="onResizeEnd($event)"
    >
      <z-resizable-panel [zDefaultSize]="defaultSize1" [zMin]="min1" [zMax]="max1" [zCollapsible]="collapsible1">
        Panel 1
      </z-resizable-panel>
      <z-resizable-handle [zHandleIndex]="0" [zWithHandle]="withHandle" [zDisabled]="handleDisabled" />
      <z-resizable-panel [zDefaultSize]="defaultSize2" [zMin]="min2" [zMax]="max2" [zCollapsible]="collapsible2">
        Panel 2
      </z-resizable-panel>
    </z-resizable>
  `,
})
class TestResizableHostComponent {
  layout: 'horizontal' | 'vertical' = 'horizontal';
  lazy = false;
  defaultSize1: number | string | undefined = 50;
  defaultSize2: number | string | undefined = 50;
  min1: number | string = 10;
  max1: number | string = 80;
  min2: number | string = 20;
  max2: number | string = 90;
  collapsible1 = false;
  collapsible2 = false;
  withHandle = true;
  handleDisabled = false;

  resizeStartEvent?: ZardResizeEvent;
  resizeEvent?: ZardResizeEvent;
  resizeEndEvent?: ZardResizeEvent;

  onResizeStart(event: ZardResizeEvent) {
    this.resizeStartEvent = event;
  }

  onResize(event: ZardResizeEvent) {
    this.resizeEvent = event;
  }

  onResizeEnd(event: ZardResizeEvent) {
    this.resizeEndEvent = event;
  }
}

describe('ZardResizableComponent', () => {
  let fixture: ComponentFixture<TestResizableHostComponent>;
  let hostComponent: TestResizableHostComponent;
  let resizableComponent: ZardResizableComponent;
  let resizableElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestResizableHostComponent],
      providers: [
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestResizableHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();

    resizableComponent = fixture.debugElement.query(By.directive(ZardResizableComponent)).componentInstance;
    resizableElement = fixture.debugElement.query(By.directive(ZardResizableComponent)).nativeElement;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(resizableComponent).toBeTruthy();
    });

    it('should have correct default layout', () => {
      expect(resizableComponent.zLayout()).toBe('horizontal');
    });

    it('should set data-layout attribute on host', () => {
      expect(resizableElement.getAttribute('data-layout')).toBe('horizontal');
    });

    it('should apply CSS classes for horizontal layout', () => {
      expect(resizableElement.classList).toContain('flex');
    });
  });

  describe('Layout Configuration', () => {
    it('should handle vertical layout', () => {
      hostComponent.layout = 'vertical';
      fixture.detectChanges();

      expect(resizableComponent.zLayout()).toBe('vertical');
      expect(resizableElement.getAttribute('data-layout')).toBe('vertical');
    });

    it('should handle lazy mode', () => {
      hostComponent.lazy = true;
      fixture.detectChanges();

      expect(resizableComponent.zLazy()).toBe(true);
    });
  });

  describe('Panel Initialization', () => {
    it('should find and initialize panels', () => {
      const panels = resizableComponent.panels();
      expect(panels.length).toBe(2);
    });

    it('should initialize panel sizes from default sizes', () => {
      const sizes = resizableComponent.panelSizes();
      expect(sizes.length).toBe(2);
      expect(sizes[0]).toBe(50);
      expect(sizes[1]).toBe(50);
    });

    it('should initialize panels with equal sizes when no default size is provided', () => {
      hostComponent.defaultSize1 = undefined;
      hostComponent.defaultSize2 = undefined;
      fixture.detectChanges();

      const sizes = resizableComponent.panelSizes();
      expect(sizes[0]).toBe(50);
      expect(sizes[1]).toBe(50);
    });

    it('should handle percentage string default sizes', () => {
      // Create new fixture with different default sizes
      TestBed.resetTestingModule();

      @Component({
        selector: 'test-percentage-host',
        imports: [ZardResizableComponent, ZardResizablePanelComponent, ZardResizableHandleComponent],
        standalone: true,
        template: `
          <z-resizable>
            <z-resizable-panel zDefaultSize="60%">Panel 1</z-resizable-panel>
            <z-resizable-handle [zHandleIndex]="0" />
            <z-resizable-panel zDefaultSize="40%">Panel 2</z-resizable-panel>
          </z-resizable>
        `,
      })
      class TestPercentageHostComponent {}

      TestBed.configureTestingModule({
        imports: [TestPercentageHostComponent],
        providers: [
          {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: ZardEventManagerPlugin,
            multi: true,
          },
        ],
      });

      const percentageFixture = TestBed.createComponent(TestPercentageHostComponent);
      percentageFixture.detectChanges();

      const percentageResizable = percentageFixture.debugElement.query(
        By.directive(ZardResizableComponent),
      ).componentInstance;
      const sizes = percentageResizable.panelSizes();
      expect(sizes[0]).toBe(60);
      expect(sizes[1]).toBe(40);
    });

    it('should handle pixel string default sizes', () => {
      // Create new fixture with pixel default sizes
      TestBed.resetTestingModule();

      @Component({
        selector: 'test-pixel-host',
        imports: [ZardResizableComponent, ZardResizablePanelComponent, ZardResizableHandleComponent],
        standalone: true,
        template: `
          <z-resizable>
            <z-resizable-panel zDefaultSize="300px">Panel 1</z-resizable-panel>
            <z-resizable-handle [zHandleIndex]="0" />
            <z-resizable-panel zDefaultSize="200px">Panel 2</z-resizable-panel>
          </z-resizable>
        `,
      })
      class TestPixelHostComponent {}

      TestBed.configureTestingModule({
        imports: [TestPixelHostComponent],
        providers: [
          {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: ZardEventManagerPlugin,
            multi: true,
          },
        ],
      });

      const pixelFixture = TestBed.createComponent(TestPixelHostComponent);

      // Mock container size before initialization
      const pixelElement = pixelFixture.debugElement.query(By.directive(ZardResizableComponent)).nativeElement;
      Object.defineProperty(pixelElement, 'offsetWidth', { value: 500, configurable: true });

      pixelFixture.detectChanges();

      const pixelResizable = pixelFixture.debugElement.query(By.directive(ZardResizableComponent)).componentInstance;
      const sizes = pixelResizable.panelSizes();
      expect(sizes[0]).toBe(60); // 300px / 500px * 100 = 60%
      expect(sizes[1]).toBe(40); // 200px / 500px * 100 = 40%
    });
  });

  describe('Value Conversion', () => {
    it('should convert percentage values correctly', () => {
      const result = resizableComponent.convertToPercentage('50%', 1000);
      expect(result).toBe(50);
    });

    it('should convert pixel values correctly', () => {
      const result = resizableComponent.convertToPercentage('300px', 1000);
      expect(result).toBe(30);
    });

    it('should handle numeric values', () => {
      const result = resizableComponent.convertToPercentage(75, 1000);
      expect(result).toBe(75);
    });

    it('should handle invalid values', () => {
      const result = resizableComponent.convertToPercentage('invalid', 1000);
      expect(result).toBe(0);
    });
  });

  describe('Resize Events', () => {
    beforeEach(() => {
      Object.defineProperty(resizableElement, 'offsetWidth', { value: 1000, configurable: true });
      Object.defineProperty(resizableElement, 'offsetHeight', { value: 600, configurable: true });
    });

    it('should emit resize start event', () => {
      const mouseEvent = new MouseEvent('mousedown', { clientX: 500 });
      resizableComponent.startResize(0, mouseEvent);

      expect(hostComponent.resizeStartEvent).toBeDefined();
      expect(hostComponent.resizeStartEvent?.layout).toBe('horizontal');
      expect(hostComponent.resizeStartEvent?.sizes).toEqual([50, 50]);
    });

    it('should handle mouse move during resize', () => {
      const mouseDownEvent = new MouseEvent('mousedown', { clientX: 500 });
      resizableComponent.startResize(0, mouseDownEvent);

      const mouseMoveEvent = new MouseEvent('mousemove', { clientX: 550 });
      document.dispatchEvent(mouseMoveEvent);

      expect(hostComponent.resizeEvent).toBeDefined();
    });

    it('should handle touch events', () => {
      const touchMock = { clientX: 500, clientY: 300 } as Touch;
      const listMock: TouchList = { length: 1, item: (index: number) => touchMock, 0: touchMock };
      const touchStartEvent = new TouchEvent('touchstart', {
        touches: listMock as unknown as Touch[],
      });
      resizableComponent.startResize(0, touchStartEvent);

      expect(hostComponent.resizeStartEvent).toBeDefined();
    });

    it('should emit resize end event on mouse up', () => {
      const mouseDownEvent = new MouseEvent('mousedown', { clientX: 500 });
      resizableComponent.startResize(0, mouseDownEvent);

      const mouseUpEvent = new MouseEvent('mouseup');
      document.dispatchEvent(mouseUpEvent);

      expect(hostComponent.resizeEndEvent).toBeDefined();
    });
  });

  describe('Panel Collapsing', () => {
    beforeEach(() => {
      hostComponent.collapsible1 = true;
      fixture.detectChanges();
    });

    it('should collapse panel when collapsible', () => {
      const initialSizes = [...resizableComponent.panelSizes()];
      resizableComponent.collapsePanel(0);

      const sizes = resizableComponent.panelSizes();
      expect(sizes[0]).toBe(0);
      expect(sizes[1]).toBeGreaterThan(initialSizes[1]);
    });

    it('should expand collapsed panel', () => {
      resizableComponent.collapsePanel(0);
      resizableComponent.collapsePanel(0);

      const sizes = resizableComponent.panelSizes();
      expect(sizes[0]).toBeGreaterThan(0);
    });

    it('should not collapse non-collapsible panel', () => {
      hostComponent.collapsible1 = false;
      fixture.detectChanges();

      const initialSizes = [...resizableComponent.panelSizes()];
      resizableComponent.collapsePanel(0);

      const sizes = resizableComponent.panelSizes();
      expect(sizes).toEqual(initialSizes);
    });
  });

  describe('Container Size', () => {
    it('should get horizontal container size', () => {
      Object.defineProperty(resizableElement, 'offsetWidth', { value: 800, configurable: true });
      const size = resizableComponent.getContainerSize();
      expect(size).toBe(800);
    });

    it('should get vertical container size', () => {
      hostComponent.layout = 'vertical';
      fixture.detectChanges();

      Object.defineProperty(resizableElement, 'offsetHeight', { value: 600, configurable: true });
      const size = resizableComponent.getContainerSize();
      expect(size).toBe(600);
    });
  });

  describe('Style Updates', () => {
    it('should update panel styles for horizontal layout', () => {
      resizableComponent.panelSizes.set([60, 40]);
      resizableComponent.updatePanelStyles();

      const panels = fixture.debugElement.queryAll(By.directive(ZardResizablePanelComponent));
      const panel1Element = panels[0].nativeElement;
      const panel2Element = panels[1].nativeElement;

      expect(panel1Element.style.width).toBe('60%');
      expect(panel1Element.style.height).toBe('100%');
      expect(panel2Element.style.width).toBe('40%');
      expect(panel2Element.style.height).toBe('100%');
    });

    it('should update panel styles for vertical layout', () => {
      hostComponent.layout = 'vertical';
      fixture.detectChanges();

      resizableComponent.panelSizes.set([60, 40]);
      resizableComponent.updatePanelStyles();

      const panels = fixture.debugElement.queryAll(By.directive(ZardResizablePanelComponent));
      const panel1Element = panels[0].nativeElement;
      const panel2Element = panels[1].nativeElement;

      expect(panel1Element.style.height).toBe('60%');
      expect(panel1Element.style.width).toBe('100%');
      expect(panel2Element.style.height).toBe('40%');
      expect(panel2Element.style.width).toBe('100%');
    });
  });

  describe('Min/Max Constraints', () => {
    beforeEach(() => {
      Object.defineProperty(resizableElement, 'offsetWidth', { value: 1000, configurable: true });
    });

    it('should respect min size constraints during resize', () => {
      hostComponent.min1 = 20;
      hostComponent.min2 = 15;
      fixture.detectChanges();

      resizableComponent.panelSizes.set([25, 75]);
      const mouseDownEvent = new MouseEvent('mousedown', { clientX: 250 });
      resizableComponent.startResize(0, mouseDownEvent);

      // Try to resize beyond min constraints
      const mouseMoveEvent = new MouseEvent('mousemove', { clientX: 150 });
      document.dispatchEvent(mouseMoveEvent);

      const sizes = resizableComponent.panelSizes();
      expect(sizes[0]).toBeGreaterThanOrEqual(20);
      expect(sizes[1]).toBeGreaterThanOrEqual(15);
    });

    it('should respect max size constraints during resize', () => {
      hostComponent.max1 = 70;
      hostComponent.max2 = 80;
      fixture.detectChanges();

      resizableComponent.panelSizes.set([60, 40]);
      const mouseDownEvent = new MouseEvent('mousedown', { clientX: 600 });
      resizableComponent.startResize(0, mouseDownEvent);

      // Try to resize beyond max constraints
      const mouseMoveEvent = new MouseEvent('mousemove', { clientX: 800 });
      document.dispatchEvent(mouseMoveEvent);

      const sizes = resizableComponent.panelSizes();
      expect(sizes[0]).toBeLessThanOrEqual(70);
      expect(sizes[1]).toBeLessThanOrEqual(80);
    });
  });

  describe('Lazy Mode', () => {
    it('should not update styles during resize in lazy mode', () => {
      hostComponent.lazy = true;
      fixture.detectChanges();

      const spy = jest.spyOn(resizableComponent, 'updatePanelStyles');

      const mouseDownEvent = new MouseEvent('mousedown', { clientX: 500 });
      resizableComponent.startResize(0, mouseDownEvent);

      const mouseMoveEvent = new MouseEvent('mousemove', { clientX: 550 });
      document.dispatchEvent(mouseMoveEvent);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should update styles at end of resize in lazy mode', () => {
      hostComponent.lazy = true;
      fixture.detectChanges();

      const spy = jest.spyOn(resizableComponent, 'updatePanelStyles');

      const mouseDownEvent = new MouseEvent('mousedown', { clientX: 500 });
      resizableComponent.startResize(0, mouseDownEvent);

      const mouseUpEvent = new MouseEvent('mouseup');
      document.dispatchEvent(mouseUpEvent);

      expect(spy).toHaveBeenCalled();
    });
  });
});
```

## resizable.component.ts
```typescript
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  type AfterContentInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  ElementRef,
  inject,
  input,
  type OnDestroy,
  output,
  PLATFORM_ID,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardResizablePanelComponent } from '@/shared/components/resizable/resizable-panel.component';
import { resizableVariants, type ZardResizableLayoutVariants } from '@/shared/components/resizable/resizable.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

export interface ZardResizeEvent {
  sizes: number[];
  layout: 'horizontal' | 'vertical';
}

@Component({
  selector: 'z-resizable, [z-resizable]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    '[attr.data-layout]': 'zLayout()',
  },
  exportAs: 'zResizable',
})
export class ZardResizableComponent implements AfterContentInit, OnDestroy {
  private readonly elementRef = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private listenersCleanup!: () => void | undefined;

  readonly zLayout = input<ZardResizableLayoutVariants>('horizontal');
  readonly zLazy = input(false, { transform: booleanAttribute });
  readonly class = input<ClassValue>('');

  readonly zResizeStart = output<ZardResizeEvent>();
  readonly zResize = output<ZardResizeEvent>();
  readonly zResizeEnd = output<ZardResizeEvent>();

  readonly panels = contentChildren(ZardResizablePanelComponent);
  readonly panelSizes = signal<number[]>([]);
  protected readonly isResizing = signal(false);
  protected readonly activeHandleIndex = signal<number | null>(null);
  protected readonly classes = computed(() =>
    mergeClasses(resizableVariants({ zLayout: this.zLayout() }), this.class()),
  );

  ngAfterContentInit(): void {
    this.initializePanelSizes();
  }

  ngOnDestroy(): void {
    this.listenersCleanup?.();
  }

  convertToPercentage(value: number | string, containerSize: number): number {
    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string') {
      if (value.endsWith('%')) {
        return Number.parseFloat(value);
      }
      if (value.endsWith('px')) {
        const pixels = Number.parseFloat(value);

        if (containerSize <= 0) {
          return 0;
        }
        return (pixels / containerSize) * 100;
      }
    }

    return Number.parseFloat(value.toString()) || 0;
  }

  private initializePanelSizes(): void {
    const panels = this.panels();
    const totalPanels = panels.length;

    if (totalPanels === 0) {
      return;
    }

    const containerSize = this.getContainerSize();
    const sizes = panels.map(panel => {
      const defaultSize = panel.zDefaultSize();
      if (defaultSize !== undefined) {
        return this.convertToPercentage(defaultSize, containerSize);
      }
      return 100 / totalPanels;
    });

    this.panelSizes.set(sizes);
    this.updatePanelStyles();
  }

  startResize(handleIndex: number, event: MouseEvent | TouchEvent): void {
    event.preventDefault();
    this.isResizing.set(true);
    this.activeHandleIndex.set(handleIndex);

    const sizes = [...this.panelSizes()];
    this.zResizeStart.emit({ sizes, layout: this.zLayout() ?? 'horizontal' });

    const startPosition = this.getEventPosition(event);
    const startSizes = [...sizes];

    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      this.handleResize(moveEvent, handleIndex, startPosition, startSizes);
    };

    const handleEnd = () => {
      this.endResize();
      if (this.isBrowser) {
        this.listenersCleanup?.();
      }
    };

    if (this.isBrowser) {
      this.document.addEventListener('mousemove', handleMove);
      this.document.addEventListener('touchmove', handleMove);
      this.document.addEventListener('mouseup', handleEnd);
      this.document.addEventListener('touchend', handleEnd);

      this.listenersCleanup = () => {
        this.document.removeEventListener('mousemove', handleMove);
        this.document.removeEventListener('touchmove', handleMove);
        this.document.removeEventListener('mouseup', handleEnd);
        this.document.removeEventListener('touchend', handleEnd);
      };
    }
  }

  private handleResize(
    event: MouseEvent | TouchEvent,
    handleIndex: number,
    startPosition: number,
    startSizes: number[],
  ): void {
    const currentPosition = this.getEventPosition(event);
    const delta = currentPosition - startPosition;
    const containerSize = this.getContainerSize();
    const deltaPercentage = (delta / containerSize) * 100;

    const newSizes = [...startSizes];
    const panels = this.panels();

    const leftPanel = panels[handleIndex];
    const rightPanel = panels[handleIndex + 1];

    if (!leftPanel || !rightPanel) {
      return;
    }

    const leftMin = this.convertToPercentage(leftPanel.zMin(), containerSize);
    const leftMax = this.convertToPercentage(leftPanel.zMax(), containerSize);
    const rightMin = this.convertToPercentage(rightPanel.zMin(), containerSize);
    const rightMax = this.convertToPercentage(rightPanel.zMax(), containerSize);

    let newLeftSize = startSizes[handleIndex] + deltaPercentage;
    let newRightSize = startSizes[handleIndex + 1] - deltaPercentage;

    newLeftSize = Math.max(leftMin, Math.min(leftMax, newLeftSize));
    newRightSize = Math.max(rightMin, Math.min(rightMax, newRightSize));

    const totalSize = newLeftSize + newRightSize;
    const originalTotal = startSizes[handleIndex] + startSizes[handleIndex + 1];

    if (Math.abs(totalSize - originalTotal) < 0.01) {
      newSizes[handleIndex] = newLeftSize;
      newSizes[handleIndex + 1] = newRightSize;

      this.panelSizes.set(newSizes);

      if (!this.zLazy()) {
        this.updatePanelStyles();
      }

      this.zResize.emit({ sizes: newSizes, layout: this.zLayout() ?? 'horizontal' });
    }
  }

  private endResize(): void {
    this.isResizing.set(false);
    this.activeHandleIndex.set(null);

    if (this.zLazy()) {
      this.updatePanelStyles();
    }

    const sizes = [...this.panelSizes()];
    this.zResizeEnd.emit({ sizes, layout: this.zLayout() ?? 'horizontal' });
  }

  updatePanelStyles(): void {
    const panels = this.panels();
    const sizes = this.panelSizes();
    const layout = this.zLayout();

    for (let index = 0; index < panels.length; index++) {
      const size = sizes[index];
      if (size !== undefined && size !== null) {
        const element = panels[index].elementRef.nativeElement as HTMLElement;
        if (layout === 'vertical') {
          element.style.height = `${size}%`;
          element.style.width = '100%';
        } else {
          element.style.width = `${size}%`;
          element.style.height = '100%';
        }
      }
    }
  }

  private getEventPosition(event: MouseEvent | TouchEvent): number {
    const layout = this.zLayout();
    let position = 0;

    if (event instanceof MouseEvent) {
      position = layout === 'vertical' ? event.clientY : event.clientX;
    } else {
      const touch = event.touches.item(0);
      if (touch) {
        const { clientX, clientY } = touch;
        position = layout === 'vertical' ? clientY : clientX;
      }
    }

    return position;
  }

  getContainerSize(): number {
    const element = this.elementRef.nativeElement as HTMLElement;
    const layout = this.zLayout();
    const { offsetHeight, offsetWidth } = element;
    return layout === 'vertical' ? offsetHeight : offsetWidth;
  }

  // TODO: Consider simplifying collapse logic - handle edge cases where totalOthers is 0 more explicitly
  collapsePanel(index: number): void {
    const panels = this.panels();
    const panel = panels[index];

    if (!panel?.zCollapsible()) {
      return;
    }

    let sizes = [...this.panelSizes()];
    const isCollapsed = sizes[index] === 0;

    if (isCollapsed) {
      const containerSize = this.getContainerSize();
      const defaultSize = this.convertToPercentage(panel.zDefaultSize() ?? 100 / panels.length, containerSize);

      sizes[index] = defaultSize;

      const totalOthers = this.othersTotal(sizes, index);
      if (totalOthers === 0) {
        const share = (100 - defaultSize) / (sizes.length - 1);
        sizes = sizes.map((s, i) => (i === index ? defaultSize : share));
      } else {
        const scale = (100 - defaultSize) / totalOthers;
        sizes = this.scaleSizes(sizes, index, scale);
      }
    } else {
      const collapsedSize = sizes[index];

      sizes[index] = 0;

      const totalOthers = this.othersTotal(sizes, index);
      if (totalOthers === 0) {
        const share = (100 - collapsedSize) / (sizes.length - 1);
        sizes = sizes.map((s, i) => (i === index ? collapsedSize : share));
      } else {
        const scale = (totalOthers + collapsedSize) / totalOthers;
        sizes = this.scaleSizes(sizes, index, scale);
      }
    }

    this.panelSizes.set(sizes);
    this.updatePanelStyles();
    this.zResize.emit({ sizes, layout: this.zLayout() ?? 'horizontal' });
  }

  private scaleSizes(sizes: number[], index: number, scale: number): number[] {
    return sizes.map((size, i) => (i === index ? size : size * scale));
  }

  private othersTotal(sizes: number[], index: number): number {
    return sizes.reduce((sum, size, i) => (i === index ? sum : sum + size), 0);
  }
}
```

## resizable.imports.ts
```typescript
import { ZardResizableHandleComponent } from '@/shared/components/resizable/resizable-handle.component';
import { ZardResizablePanelComponent } from '@/shared/components/resizable/resizable-panel.component';
import { ZardResizableComponent } from '@/shared/components/resizable/resizable.component';

export const ZardResizableImports = [
  ZardResizableComponent,
  ZardResizableHandleComponent,
  ZardResizablePanelComponent,
] as const;
```

## resizable.variants.ts
```typescript
import { cva, type VariantProps } from 'class-variance-authority';

export const resizableVariants = cva('flex h-full w-full data-[layout=vertical]:flex-col overflow-hidden', {
  variants: {
    zLayout: {
      horizontal: '',
      vertical: '',
    },
  },
  defaultVariants: {
    zLayout: 'horizontal',
  },
});

export const resizablePanelVariants = cva('relative overflow-hidden shrink-0 h-full', {
  variants: {
    zCollapsed: {
      true: 'hidden',
      false: '',
    },
  },
  defaultVariants: {
    zCollapsed: false,
  },
});

export const resizableHandleVariants = cva(
  'group relative flex shrink-0 items-center justify-center bg-border transition-colors hover:bg-border/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1',
  {
    variants: {
      zLayout: {
        horizontal:
          'w-px min-w-px cursor-col-resize after:absolute after:inset-y-0 after:left-1/2 after:w-4 after:-translate-x-1/2',
        vertical:
          'h-px min-h-px w-full cursor-row-resize after:absolute after:inset-x-0 after:top-1/2 after:h-4 after:-translate-y-1/2',
      },
      zDisabled: {
        true: 'cursor-default pointer-events-none opacity-50',
        false: '',
      },
    },
    defaultVariants: {
      zLayout: 'horizontal',
      zDisabled: false,
    },
  },
);

export const resizableHandleIndicatorVariants = cva(
  'absolute z-10 bg-muted-foreground/30 transition-colors group-hover:bg-muted-foreground/50 rounded-full',
  {
    variants: {
      zLayout: {
        vertical: 'w-8 h-px',
        horizontal: 'w-px h-8',
      },
    },
    defaultVariants: {
      zLayout: 'horizontal',
    },
  },
);

export type ZardResizableLayoutVariants = NonNullable<VariantProps<typeof resizableVariants>['zLayout']>;
```

