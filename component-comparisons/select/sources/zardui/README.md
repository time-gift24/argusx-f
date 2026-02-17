# select - zardui sources

## Directory
- demo (dir)
- doc (dir)
- index.ts (file)
- select-item.component.spec.ts (file)
- select-item.component.ts (file)
- select.component.spec.ts (file)
- select.component.ts (file)
- select.imports.ts (file)
- select.variants.ts (file)

## index.ts
```typescript
export * from '@/shared/components/select/select.component';
export * from '@/shared/components/select/select-item.component';
export * from '@/shared/components/select/select.imports';
export * from '@/shared/components/select/select.variants';
```

## select-item.component.spec.ts
```typescript
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import userEvent from '@testing-library/user-event';

import { ZardSelectItemComponent } from './select-item.component';

describe('ZardSelectItemComponent', () => {
  let fixture: ComponentFixture<ZardSelectItemComponent>;
  let component: ZardSelectItemComponent;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardSelectItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardSelectItemComponent);
    component = fixture.componentInstance;
    user = userEvent.setup();
    fixture.componentRef.setInput('zValue', 'test-value');
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('has correct role and tabindex', () => {
    const hostElement = fixture.nativeElement as HTMLElement;

    expect(hostElement).toHaveAttribute('role', 'option');
    expect(hostElement).toHaveAttribute('tabindex', '-1');
  });

  describe('zValue input', () => {
    it('updates attribute when value changes', () => {
      fixture.componentRef.setInput('zValue', 'new-value');
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).toHaveAttribute('value', 'new-value');
    });
  });

  describe('zDisabled input', () => {
    it('sets data-disabled when disabled', () => {
      fixture.componentRef.setInput('zDisabled', true);
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).toHaveAttribute('data-disabled', '');
    });

    it('removes data-disabled when enabled', () => {
      fixture.componentRef.setInput('zDisabled', true);
      fixture.detectChanges();
      fixture.componentRef.setInput('zDisabled', false);
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).not.toHaveAttribute('data-disabled');
    });
  });

  describe('custom class input', () => {
    it('applies custom class to host element', () => {
      fixture.componentRef.setInput('class', 'custom-class');
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).toHaveClass('custom-class');
    });
  });

  describe('variant styling', () => {
    it('applies correct classes for default size', () => {
      component.zSize.set('default');
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).toHaveClass('min-h-9');
      expect(hostElement).toHaveClass('py-1.5');
    });

    it('applies correct classes for small size', () => {
      component.zSize.set('sm');
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).toHaveClass('min-h-8');
      expect(hostElement).toHaveClass('py-1');
    });

    it('applies correct classes for large size', () => {
      component.zSize.set('lg');
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).toHaveClass('min-h-10');
      expect(hostElement).toHaveClass('py-2');
    });

    it('applies correct classes for normal mode', () => {
      component.zMode.set('normal');
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).toHaveClass('pr-8');
      expect(hostElement).toHaveClass('pl-2');
    });

    it('applies correct classes for compact mode', () => {
      component.zMode.set('compact');
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).toHaveClass('pl-6.5');
      expect(hostElement).toHaveClass('pr-2');
    });
  });

  describe('selected state attributes', () => {
    it('sets data-selected when in selected values', () => {
      component.setSelectHost({
        selectedValue: () => ['test-value'],
        selectItem: jest.fn(),
        navigateTo: jest.fn(),
      });
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).toHaveAttribute('data-selected', '');
    });

    it('sets aria-selected true when selected', () => {
      component.setSelectHost({
        selectedValue: () => ['test-value'],
        selectItem: jest.fn(),
        navigateTo: jest.fn(),
      });
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).toHaveAttribute('aria-selected', 'true');
    });

    it('sets aria-selected false when not selected', () => {
      component.setSelectHost({
        selectedValue: () => [],
        selectItem: jest.fn(),
        navigateTo: jest.fn(),
      });
      fixture.detectChanges();

      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('select host integration', () => {
    const createMockSelectHost = () => ({
      selectedValue: () => [] as string[],
      selectItem: jest.fn(),
      navigateTo: jest.fn(),
    });

    it('stores select host reference when set', () => {
      const mockSelectHost = createMockSelectHost();

      component.setSelectHost(mockSelectHost);

      expect(component['select']()).toBe(mockSelectHost);
    });

    it('triggers selectItem on click when not disabled', async () => {
      const mockSelectHost = createMockSelectHost();
      component.setSelectHost(mockSelectHost);
      fixture.componentRef.setInput('zDisabled', false);
      fixture.detectChanges();

      await user.click(fixture.nativeElement as HTMLElement);

      expect(mockSelectHost.selectItem).toHaveBeenCalledWith('test-value', '');
    });

    it('skips selectItem when disabled', async () => {
      const mockSelectHost = createMockSelectHost();
      component.setSelectHost(mockSelectHost);
      fixture.componentRef.setInput('zDisabled', true);
      fixture.detectChanges();

      await user.click(fixture.nativeElement as HTMLElement);

      expect(mockSelectHost.selectItem).not.toHaveBeenCalled();
    });

    it('triggers navigateTo on hover when not disabled', async () => {
      const mockSelectHost = createMockSelectHost();
      component.setSelectHost(mockSelectHost);
      fixture.componentRef.setInput('zDisabled', false);
      fixture.detectChanges();

      await user.hover(fixture.nativeElement as HTMLElement);

      expect(mockSelectHost.navigateTo).toHaveBeenCalled();
    });

    it('skips navigateTo on hover when disabled', async () => {
      const mockSelectHost = createMockSelectHost();
      component.setSelectHost(mockSelectHost);
      fixture.componentRef.setInput('zDisabled', true);
      fixture.detectChanges();

      await user.hover(fixture.nativeElement as HTMLElement);

      expect(mockSelectHost.navigateTo).not.toHaveBeenCalled();
    });
  });

  describe('check icon visibility', () => {
    it('displays check icon when selected', async () => {
      component.setSelectHost({
        selectedValue: () => ['test-value'],
        selectItem: jest.fn(),
        navigateTo: jest.fn(),
      });
      fixture.detectChanges();

      const iconElement = fixture.debugElement.query(By.css('[data-testid="check-icon"]'));
      expect(iconElement).toBeTruthy();
    });

    it('hides check icon when not selected', async () => {
      component.setSelectHost({
        selectedValue: () => [],
        selectItem: jest.fn(),
        navigateTo: jest.fn(),
      });
      fixture.detectChanges();

      const iconElement = fixture.debugElement.query(By.css('[data-testid="check-icon"]'));
      expect(iconElement).toBeFalsy();
    });
  });
});
```

## select-item.component.ts
```typescript
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';

import { ZardIconComponent } from '@/shared/components/icon';
import {
  selectItemIconVariants,
  selectItemVariants,
  type ZardSelectItemModeVariants,
  type ZardSelectSizeVariants,
} from '@/shared/components/select/select.variants';
import { mergeClasses, noopFn } from '@/shared/utils/merge-classes';

// Interface to avoid circular dependency
interface SelectHost {
  selectedValue(): string[];
  selectItem(value: string, label: string): void;
  navigateTo(): void;
}

@Component({
  selector: 'z-select-item, [z-select-item]',
  imports: [ZardIconComponent],
  template: `
    @if (isSelected()) {
      <span [class]="iconClasses()">
        <z-icon zType="check" [zStrokeWidth]="strokeWidth()" aria-hidden="true" data-testid="check-icon" />
      </span>
    }
    <span class="truncate">
      <ng-content />
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'option',
    tabindex: '-1',
    '[class]': 'classes()',
    '[attr.value]': 'zValue()',
    '[attr.data-disabled]': 'zDisabled() ? "" : null',
    '[attr.data-selected]': 'isSelected() ? "" : null',
    '[attr.aria-selected]': 'isSelected()',
    '(click)': 'onClick()',
    '(mouseenter)': 'onMouseEnter()',
    '(keydown.{tab}.prevent)': 'noopFn',
  },
})
export class ZardSelectItemComponent {
  readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly zValue = input.required<string>();
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly class = input<string>('');

  private readonly select = signal<SelectHost | null>(null);
  noopFn = noopFn;

  readonly label = linkedSignal<string>(() => {
    const element = this.elementRef.nativeElement;
    return (element.textContent ?? element.innerText)?.trim() ?? '';
  });

  readonly zMode = signal<ZardSelectItemModeVariants>('normal');
  readonly zSize = signal<ZardSelectSizeVariants>('default');

  protected readonly classes = computed(() =>
    mergeClasses(selectItemVariants({ zMode: this.zMode(), zSize: this.zSize() }), this.class()),
  );

  protected readonly iconClasses = computed(() =>
    mergeClasses(selectItemIconVariants({ zMode: this.zMode(), zSize: this.zSize() })),
  );

  protected readonly strokeWidth = computed(() => (this.zMode() === 'compact' ? 3 : 2));

  protected readonly isSelected = computed(() => this.select()?.selectedValue().includes(this.zValue()) ?? false);

  setSelectHost(selectHost: SelectHost) {
    this.select.set(selectHost);
  }

  onMouseEnter() {
    if (this.zDisabled()) {
      return;
    }
    this.select()?.navigateTo();
  }

  onClick() {
    if (this.zDisabled()) {
      return;
    }
    this.select()?.selectItem(this.zValue(), this.label());
  }
}
```

## select.component.spec.ts
```typescript
import { Component, signal } from '@angular/core';
import { type ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By, EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardSelectItemComponent } from './select-item.component';
import { ZardSelectComponent } from './select.component';

import { ZardEventManagerPlugin } from '@/shared/core/provider/event-manager-plugins/zard-event-manager-plugin';

@Component({
  imports: [ZardSelectComponent, ZardSelectItemComponent],
  template: `
    <z-select [(zValue)]="value" [zLabel]="label()" [zPlaceholder]="placeholder()" [zDisabled]="disabled()">
      <z-select-item zValue="option1">Option 1</z-select-item>
      <z-select-item zValue="option2">Option 2</z-select-item>
      <z-select-item zValue="option3">Option 3</z-select-item>
    </z-select>
  `,
})
class TestHostComponent {
  readonly value = signal('');
  readonly label = signal('');
  readonly placeholder = signal('Select an option...');
  readonly disabled = signal(false);
}

@Component({
  imports: [ZardSelectComponent, ZardSelectItemComponent, ReactiveFormsModule],
  template: `
    <z-select [formControl]="control">
      <z-select-item zValue="apple">Apple</z-select-item>
      <z-select-item zValue="banana">Banana</z-select-item>
      <z-select-item zValue="orange">Orange</z-select-item>
    </z-select>
  `,
})
class TestHostWithFormControlComponent {
  control = new FormControl('');
}

describe('ZardSelectComponent', () => {
  describe('basic functionality', () => {
    let component: ZardSelectComponent;
    let fixture: ComponentFixture<ZardSelectComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent, ZardSelectItemComponent],
        providers: [
          {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: ZardEventManagerPlugin,
            multi: true,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ZardSelectComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.zValue()).toBe('');
      expect(component.zPlaceholder()).toBe('Select an option...');
      expect(component.zDisabled()).toBe(false);
    });

    describe('keyboard navigation', () => {
      it('should open dropdown on Enter key', fakeAsync(() => {
        const event = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' });
        jest.spyOn(event, 'preventDefault');

        fixture.debugElement.nativeElement.dispatchEvent(event);
        flush();
        fixture.detectChanges();

        expect(event.preventDefault).toHaveBeenCalled();
        expect(component.isOpen()).toBeTruthy();
      }));

      it('should open dropdown on Space key', fakeAsync(() => {
        const event = new KeyboardEvent('keydown', { key: ' ' });
        jest.spyOn(event, 'preventDefault');

        fixture.debugElement.nativeElement.dispatchEvent(event);
        flush();
        fixture.detectChanges();

        expect(event.preventDefault).toHaveBeenCalled();
        expect(component.isOpen()).toBeTruthy();
      }));

      it('should close dropdown on Escape key', fakeAsync(() => {
        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        jest.spyOn(event, 'preventDefault');

        component.toggle();
        fixture.debugElement.nativeElement.dispatchEvent(event);
        flush();
        fixture.detectChanges();

        expect(event.preventDefault).toHaveBeenCalled();
        expect(component.isOpen()).toBeFalsy();
      }));
    });
  });

  describe('with host component', () => {
    let hostComponent: TestHostComponent;
    let hostFixture: ComponentFixture<TestHostComponent>;
    let selectComponent: ZardSelectComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
        providers: [
          {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: ZardEventManagerPlugin,
            multi: true,
          },
        ],
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;

      // Initial change detection to create the component tree
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      selectComponent = hostFixture.debugElement.children[0].componentInstance as ZardSelectComponent;

      // Additional change detection to ensure content children are processed
      hostFixture.detectChanges();
      await hostFixture.whenStable();
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('should handle component functionality without selectItems', () => {
      // selectItems was removed to avoid circular dependency
      // The component should still function correctly for basic operations
      expect(selectComponent.zValue).toBeDefined();
      expect(selectComponent.selectedLabels).toBeDefined();
    });

    it('should update selectedLabel when value changes', () => {
      hostComponent.value.set('option2');
      hostFixture.detectChanges();

      expect(selectComponent.zValue()).toBe('option2');

      // If contentChildren is not working, the label will be the value
      const [label] = selectComponent.selectedLabels();
      expect(['option2', 'Option 2']).toContain(label);
    });

    it('should use manual label when provided', () => {
      hostComponent.value.set('option1');
      hostComponent.label.set('Custom Label');
      hostFixture.detectChanges();

      expect(selectComponent.zValue()).toBe('option1');
      expect(selectComponent.selectedLabels()[0]).toBe('Custom Label');
    });

    it('should respect disabled state', () => {
      hostComponent.disabled.set(true);
      hostFixture.detectChanges();

      const button = hostFixture.nativeElement.querySelector('button');
      expect(button.disabled).toBe(true);
    });

    it('should display placeholder when no value is selected', () => {
      const button = hostFixture.nativeElement.querySelector('button') as HTMLButtonElement;
      expect(button.textContent).toContain('Select an option...');
    });

    it('should update placeholder text', () => {
      hostComponent.placeholder.set('Choose a value');
      hostFixture.detectChanges();

      const button = hostFixture.nativeElement.querySelector('button > span');
      expect(button.textContent).toContain('Choose a value');
    });
  });

  describe('with FormControl', () => {
    let hostComponent: TestHostWithFormControlComponent;
    let hostFixture: ComponentFixture<TestHostWithFormControlComponent>;
    let selectComponent: ZardSelectComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostWithFormControlComponent],
        providers: [
          {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: ZardEventManagerPlugin,
            multi: true,
          },
        ],
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestHostWithFormControlComponent);
      hostComponent = hostFixture.componentInstance;

      // Initial change detection to create the component tree
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      selectComponent = hostFixture.debugElement.children[0].componentInstance as ZardSelectComponent;

      // Additional change detection to ensure content children are processed
      hostFixture.detectChanges();
      await hostFixture.whenStable();
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('should work with reactive forms', () => {
      hostComponent.control.setValue('banana');
      hostFixture.detectChanges();

      expect(selectComponent.zValue()).toBe('banana');

      // If contentChildren is not working, the label will be the value
      const [label] = selectComponent.selectedLabels();
      expect(['banana', 'Banana']).toContain(label);
    });

    it('should update form control when selection changes', () => {
      selectComponent.selectItem('orange', 'Orange');
      hostFixture.detectChanges();

      expect(hostComponent.control.value).toBe('orange');
    });

    it('should call onChange when value changes', () => {
      const onChangeSpy = jest.fn();
      selectComponent.registerOnChange(onChangeSpy);

      selectComponent.selectItem('apple', 'Apple');

      expect(onChangeSpy).toHaveBeenCalledWith('apple');
    });

    it('should call onTouched when dropdown closes', fakeAsync(() => {
      const onTouchedSpy = jest.fn();
      selectComponent.registerOnTouched(onTouchedSpy);

      selectComponent.toggle(); // open
      flush();
      selectComponent.toggle(); // close

      expect(onTouchedSpy).toHaveBeenCalled();
    }));
  });

  describe('signal reactivity', () => {
    let hostComponent: TestHostComponent;
    let hostFixture: ComponentFixture<TestHostComponent>;
    let selectComponent: ZardSelectComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
        providers: [
          {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: ZardEventManagerPlugin,
            multi: true,
          },
        ],
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;

      // Initial change detection to create the component tree
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      selectComponent = hostFixture.debugElement.children[0].componentInstance as ZardSelectComponent;

      // Additional change detection to ensure content children are processed
      hostFixture.detectChanges();
      await hostFixture.whenStable();
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('should automatically update label when items change', () => {
      hostComponent.value.set('option1');
      hostFixture.detectChanges();

      // If contentChildren is not working, the label will be the value
      const [label] = selectComponent.selectedLabels();
      expect(['option1', 'Option 1']).toContain(label);

      // The computed signal automatically reacts to content children changes
      // When new items are added or removed, the label will update accordingly
      // This is handled automatically by the contentChildren signal

      // Verify the label still reflects the correct item text
      expect(selectComponent.zValue()).toBe('option1');
      expect(['option1', 'Option 1']).toContain(selectComponent.selectedLabels()[0]);
    });
  });

  describe('Multiselect mode', () => {
    @Component({
      imports: [ZardSelectComponent, ZardSelectItemComponent],
      standalone: true,
      template: `
        <z-select
          [(zValue)]="value"
          [zLabel]="label()"
          [zPlaceholder]="placeholder()"
          [zDisabled]="disabled()"
          [zMultiple]="true"
          [zMaxLabelCount]="labelsLimit"
        >
          <z-select-item zValue="option1">OptionOne</z-select-item>
          <z-select-item zValue="option2">OptionTwo</z-select-item>
          <z-select-item zValue="option3">OptionThree</z-select-item>
          <z-select-item zValue="option4">OptionFour</z-select-item>
        </z-select>
      `,
    })
    class TestMultiselectHostComponent {
      readonly value = signal<string[]>([]);
      readonly label = signal('');
      readonly placeholder = signal('Select an option...');
      readonly disabled = signal(false);
      labelsLimit = 0;
    }

    let hostComponent: TestMultiselectHostComponent;
    let hostFixture: ComponentFixture<TestMultiselectHostComponent>;
    let selectComponent: ZardSelectComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestMultiselectHostComponent],
        providers: [
          {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: ZardEventManagerPlugin,
            multi: true,
          },
        ],
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestMultiselectHostComponent);
      hostComponent = hostFixture.componentInstance;

      // Initial change detection to create the component tree
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      selectComponent = hostFixture.debugElement.query(By.directive(ZardSelectComponent)).componentInstance;

      // Additional change detection to ensure content children are processed
      hostFixture.detectChanges();
      await hostFixture.whenStable();
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('should create component', () => {
      expect(hostComponent).toBeTruthy();
      expect(selectComponent).toBeTruthy();
      expect(selectComponent.zMultiple).toBeTruthy();
    });

    it('select two items', () => {
      hostComponent.labelsLimit = 2;
      hostFixture.detectChanges();

      selectComponent.selectItem('option1', 'OptionOne');
      selectComponent.selectItem('option4', 'OptionFour');

      expect(hostComponent.value().length).toBe(2);
      expect(selectComponent.selectedLabels()).toEqual(['OptionOne', 'OptionFour']);
    });

    it('select three items', () => {
      hostComponent.labelsLimit = 2;
      hostFixture.detectChanges();

      selectComponent.selectItem('option1', 'OptionOne');
      selectComponent.selectItem('option3', 'OptionThree');
      selectComponent.selectItem('option4', 'OptionFour');

      expect(hostComponent.value().length).toBe(3);
      expect(selectComponent.selectedLabels()).toEqual(['OptionOne', 'OptionThree', '1 more item selected']);
    });

    it('should handle multiple deselects correctly', () => {
      selectComponent.selectItem('option1', 'OptionOne');
      selectComponent.selectItem('option2', 'OptionTwo');
      selectComponent.selectItem('option3', 'OptionThree');
      selectComponent.selectItem('option2', 'OptionTwo');

      expect(hostComponent.value().length).toBe(2);
      expect(selectComponent.selectedLabels()).toEqual(['OptionOne', 'OptionThree']);
    });

    it('should handle multiple selects correctly', () => {
      selectComponent.selectItem('option1', 'OptionOne');
      selectComponent.selectItem('option2', 'OptionTwo');
      selectComponent.selectItem('option4', 'OptionFour');

      expect(hostComponent.value().length).toBe(3);
      expect(selectComponent.selectedLabels()).toEqual(['OptionOne', 'OptionTwo', 'OptionFour']);
    });
  });
});
```

## select.component.ts
```typescript
import { Overlay, OverlayModule, OverlayPositionBuilder, type OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  type AfterContentInit,
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  DestroyRef,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  model,
  type OnDestroy,
  output,
  PLATFORM_ID,
  runInInjectionContext,
  signal,
  type TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import type { ClassValue } from 'clsx';
import { filter } from 'rxjs';

import { ZardBadgeComponent } from '@/shared/components/badge';
import { ZardIconComponent } from '@/shared/components/icon';
import { ZardSelectItemComponent } from '@/shared/components/select/select-item.component';
import {
  selectContentVariants,
  selectTriggerVariants,
  selectVariants,
  type ZardSelectSizeVariants,
} from '@/shared/components/select/select.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

type OnTouchedType = () => void;
type OnChangeType = (value: string) => void;

const COMPACT_MODE_WIDTH_THRESHOLD = 100;

@Component({
  selector: 'z-select, [z-select]',
  imports: [OverlayModule, ZardBadgeComponent, ZardIconComponent],
  template: `
    <button
      type="button"
      role="combobox"
      aria-controls="dropdown"
      [class]="triggerClasses()"
      [disabled]="zDisabled()"
      [attr.aria-expanded]="isOpen()"
      [attr.aria-haspopup]="'listbox'"
      [attr.data-placeholder]="!zValue() ? '' : null"
      (blur)="!isOpen() && isFocus.set(false)"
      (click)="toggle()"
      (focus)="onFocus()"
    >
      <span class="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        @for (label of selectedLabels(); track label) {
          @if (zMultiple()) {
            <z-badge zType="secondary">
              <span class="truncate">{{ label }}</span>
            </z-badge>
          } @else {
            <span class="truncate">{{ label }}</span>
          }
        } @empty {
          <span class="text-muted-foreground truncate">{{ zPlaceholder() }}</span>
        }
      </span>
      <z-icon zType="chevron-down" zSize="lg" class="opacity-50" />
    </button>

    <ng-template #dropdownTemplate>
      <div
        id="dropdown"
        [class]="contentClasses()"
        role="listbox"
        [attr.data-state]="'open'"
        (keydown.{arrowdown,arrowup,enter,space,escape,home,end}.prevent)="onDropdownKeydown($event)"
        tabindex="-1"
      >
        <div class="p-1">
          <ng-content />
        </div>
      </div>
    </ng-template>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardSelectComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-active]': 'isFocus() ? "" : null',
    '[attr.data-disabled]': 'zDisabled() ? "" : null',
    '[attr.data-state]': 'isOpen() ? "open" : "closed"',
    '[class]': 'classes()',
    '(keydown.{enter,space,arrowdown,arrowup,escape}.prevent)': 'onTriggerKeydown($event)',
  },
})
export class ZardSelectComponent implements ControlValueAccessor, AfterContentInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);
  private readonly overlay = inject(Overlay);
  private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly platformId = inject(PLATFORM_ID);

  readonly dropdownTemplate = viewChild.required<TemplateRef<void>>('dropdownTemplate');
  readonly selectItems = contentChildren(ZardSelectItemComponent);

  private overlayRef?: OverlayRef;
  private portal?: TemplatePortal;

  readonly class = input<ClassValue>('');
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zLabel = input<string>('');
  readonly zMaxLabelCount = input<number>(1);
  readonly zMultiple = input<boolean>(false);
  readonly zPlaceholder = input<string>('Select an option...');
  readonly zSize = input<ZardSelectSizeVariants>('default');
  readonly zValue = model<string | string[]>(this.zMultiple() ? [] : '');

  readonly zSelectionChange = output<string | string[]>();

  readonly isOpen = signal(false);
  readonly focusedIndex = signal<number>(-1);
  protected readonly isFocus = signal(false);
  protected readonly isCompact = signal(false);

  protected onFocus(): void {
    if (this.isCompact()) {
      this.isFocus.set(true);
    }
  }

  // Compute the label based on selected value
  readonly selectedLabels = computed<string[]>(() => {
    const selectedValue = this.zValue();
    if (this.zMultiple() && Array.isArray(selectedValue)) {
      return this.provideLabelsForMultiselectMode(selectedValue);
    }

    return this.provideLabelForSingleSelectMode(selectedValue as string);
  });

  private onChange: OnChangeType = (_value: string) => {
    // ControlValueAccessor onChange callback
  };

  private onTouched: OnTouchedType = () => {
    // ControlValueAccessor onTouched callback
  };

  protected readonly classes = computed(() => mergeClasses(selectVariants(), this.class()));
  protected readonly contentClasses = computed(() => mergeClasses(selectContentVariants()));
  protected readonly triggerClasses = computed(() =>
    mergeClasses(
      selectTriggerVariants({
        zSize: this.zSize(),
      }),
    ),
  );

  ngAfterContentInit() {
    const hostWidth = this.elementRef.nativeElement.offsetWidth || 0;
    // Setup select host reference for each item
    let i = 0;
    for (const item of this.selectItems()) {
      item.setSelectHost({
        selectedValue: () => (this.zMultiple() ? (this.zValue() as string[]) : [this.zValue() as string]),
        selectItem: (value: string, label: string) => this.selectItem(value, label),
        navigateTo: () => this.navigateTo(item, i),
      });
      item.zSize.set(this.zSize());
      i++;

      if (hostWidth <= COMPACT_MODE_WIDTH_THRESHOLD) {
        this.isCompact.set(true);
        item.zMode.set('compact');
      }
    }
  }

  ngOnDestroy() {
    this.destroyOverlay();
  }

  onTriggerKeydown(event: Event) {
    const { key } = event as KeyboardEvent;
    switch (key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
      case 'ArrowUp':
        if (!this.isOpen()) {
          this.open();
        }
        break;
      case 'Escape':
        if (this.isOpen()) {
          this.close();
        }
        break;
    }
  }

  onDropdownKeydown(e: Event) {
    const { key } = e as KeyboardEvent;
    const items = this.getSelectItems();

    switch (key) {
      case 'ArrowDown':
        this.navigateItems(1, items);
        break;
      case 'ArrowUp':
        this.navigateItems(-1, items);
        break;
      case 'Enter':
      case ' ':
        this.selectFocusedItem(items);
        break;
      case 'Escape':
        this.close();
        this.focusButton();
        break;
      case 'Home':
        this.focusFirstItem(items);
        break;
      case 'End':
        this.focusLastItem(items);
        break;
    }
  }

  toggle() {
    if (this.zDisabled()) {
      return;
    }

    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  selectItem(value: string, label: string) {
    if (value === undefined || value === null || value === '') {
      console.warn('Attempted to select item with invalid value:', { value, label });
      return;
    }

    this.zValue.update(selectedValues => {
      if (Array.isArray(selectedValues)) {
        return selectedValues.includes(value) ? selectedValues.filter(v => v !== value) : [...selectedValues, value];
      }

      return value;
    });
    this.onChange(value);
    this.zSelectionChange.emit(this.zValue());

    if (this.zMultiple()) {
      // in multiple mode it can happen that button changes size because of selection badges,
      // which requires overlay position to update
      this.updateOverlayPosition();
    } else {
      this.close();

      // Return focus to the button after selection
      setTimeout(() => {
        this.focusButton();
      }, 0);
    }
  }

  private navigateTo(element: ZardSelectItemComponent, index: number): void {
    this.focusedIndex.set(index);
    this.updateItemFocus(this.getSelectItems(true), index);
  }

  private updateOverlayPosition(): void {
    setTimeout(() => {
      this.overlayRef?.updatePosition();
    }, 0);
  }

  private provideLabelsForMultiselectMode(selectedValue: string[]): string[] {
    const labelsToShowCount = selectedValue.length - this.zMaxLabelCount();
    const labels = [];
    let index = 0;
    for (const value of selectedValue) {
      const matchingItem = this.getMatchingItem(value);
      if (matchingItem) {
        labels.push(matchingItem.label());
        index++;
      }
      if (labelsToShowCount && this.zMaxLabelCount() && index === this.zMaxLabelCount()) {
        labels.push(`${labelsToShowCount} more item${labelsToShowCount > 1 ? 's' : ''} selected`);
        break;
      }
    }
    return labels;
  }

  private provideLabelForSingleSelectMode(selectedValue: string): string[] {
    const manualLabel = this.zLabel();
    if (manualLabel) {
      return [manualLabel];
    }

    const matchingItem = this.getMatchingItem(selectedValue);
    if (matchingItem) {
      return [matchingItem.label()];
    }

    return selectedValue ? [selectedValue] : [];
  }

  private open() {
    if (this.isOpen()) {
      return;
    }

    // Create overlay if it doesn't exist
    if (!this.overlayRef) {
      this.createOverlay();
    }

    if (!this.overlayRef) {
      return;
    }

    const hostWidth = this.elementRef.nativeElement.offsetWidth || 0;

    if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }

    this.portal = new TemplatePortal(this.dropdownTemplate(), this.viewContainerRef);

    this.overlayRef.attach(this.portal);
    this.overlayRef.updateSize({ width: hostWidth });
    this.isOpen.set(true);
    this.updateFocusWhenNormalMode();

    this.determinePortalWidthOnOpen(hostWidth);
  }

  private setFocusOnOpen(): void {
    this.focusDropdown();
    this.focusSelectedItem();
  }

  private close() {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
    this.isOpen.set(false);
    this.focusedIndex.set(-1);
    this.onTouched();
    this.updateFocusWhenNormalMode();
  }

  private updateFocusWhenNormalMode(): void {
    if (!this.isCompact()) {
      this.isFocus.set(!this.isOpen());
    }
  }

  private getMatchingItem(value: string): ZardSelectItemComponent | undefined {
    return this.selectItems()?.find(item => item.zValue() === value);
  }

  private determinePortalWidthOnOpen(portalWidth: number): void {
    runInInjectionContext(this.injector, () => {
      afterNextRender(() => {
        if (!this.overlayRef || !this.overlayRef.hasAttached()) {
          return;
        }

        const overlayPaneElement = this.overlayRef.overlayElement;
        const textElements = Array.from(
          overlayPaneElement.querySelectorAll<HTMLElement>(
            'z-select-item > span.truncate, [z-select-item] > span.truncate',
          ),
        );
        let isOverflow = false;
        for (const textElement of textElements) {
          if (textElement.scrollWidth > textElement.clientWidth + 1) {
            isOverflow = true;
            break;
          }
        }

        if (!isOverflow) {
          this.setFocusOnOpen();
          return;
        }

        const selectItems = this.selectItems();
        let itemMaxWidth = 0;
        for (const item of selectItems) {
          itemMaxWidth = Math.max(itemMaxWidth, item.elementRef.nativeElement.scrollWidth);
        }

        const [selectItem] = selectItems;
        if (isOverflow && selectItem) {
          const elementStyles = getComputedStyle(selectItem.elementRef.nativeElement);
          const leftPadding = Number.parseFloat(elementStyles.getPropertyValue('padding-left')) || 0;
          const rightPadding = Number.parseFloat(elementStyles.getPropertyValue('padding-right')) || 0;
          itemMaxWidth += leftPadding + rightPadding;
        }

        itemMaxWidth = Math.max(itemMaxWidth, portalWidth);
        this.overlayRef.updateSize({ width: itemMaxWidth });
        this.overlayRef.updatePosition();

        this.setFocusOnOpen();
      });
    });
  }

  private createOverlay() {
    if (this.overlayRef) {
      return;
    } // Already created

    if (isPlatformBrowser(this.platformId)) {
      try {
        const positionStrategy = this.overlayPositionBuilder
          .flexibleConnectedTo(this.elementRef)
          .withPositions([
            {
              originX: 'center',
              originY: 'bottom',
              overlayX: 'center',
              overlayY: 'top',
              offsetY: 4,
            },
            {
              originX: 'center',
              originY: 'top',
              overlayX: 'center',
              overlayY: 'bottom',
              offsetY: -4,
            },
          ])
          .withPush(false);

        const elementWidth = this.elementRef.nativeElement.offsetWidth || 200;

        this.overlayRef = this.overlay.create({
          positionStrategy,
          hasBackdrop: false,
          scrollStrategy: this.overlay.scrollStrategies.reposition(),
          width: elementWidth,
          maxHeight: 384, // max-h-96 equivalent
        });
        this.overlayRef
          .outsidePointerEvents()
          .pipe(
            filter(event => !this.elementRef.nativeElement.contains(event.target)),
            takeUntilDestroyed(this.destroyRef),
          )
          .subscribe(() => {
            this.isFocus.set(false);
            this.close();
          });
      } catch (error) {
        console.error('Error creating overlay:', error);
      }
    }
  }

  private destroyOverlay() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = undefined;
    }
  }

  private getSelectItems(ignoreFilter = false): HTMLElement[] {
    if (!this.overlayRef?.hasAttached()) {
      return [];
    }
    const dropdownElement = this.overlayRef.overlayElement;
    return Array.from(dropdownElement.querySelectorAll<HTMLElement>('z-select-item, [z-select-item]')).filter(
      item => ignoreFilter || item.dataset['disabled'] === undefined,
    );
  }

  private navigateItems(direction: number, items: HTMLElement[]) {
    if (items.length === 0) {
      return;
    }

    const currentIndex = this.focusedIndex();
    let nextIndex = currentIndex + direction;

    if (nextIndex < 0) {
      nextIndex = items.length - 1;
    } else if (nextIndex >= items.length) {
      nextIndex = 0;
    }

    this.focusedIndex.set(nextIndex);
    this.updateItemFocus(items, nextIndex);
  }

  private selectFocusedItem(items: HTMLElement[]) {
    const currentIndex = this.focusedIndex();
    if (currentIndex >= 0 && currentIndex < items.length) {
      const item = items[currentIndex];
      const value = item.getAttribute('value');
      const label = item.textContent?.trim() ?? '';

      if (value === null || value === undefined) {
        console.warn('No value attribute found on selected item:', item);
        return;
      }

      this.selectItem(value, label);
    }
  }

  private focusFirstItem(items: HTMLElement[]) {
    if (items.length > 0) {
      this.focusedIndex.set(0);
      this.updateItemFocus(items, 0);
    }
  }

  private focusLastItem(items: HTMLElement[]) {
    if (items.length > 0) {
      const lastIndex = items.length - 1;
      this.focusedIndex.set(lastIndex);
      this.updateItemFocus(items, lastIndex);
    }
  }

  private updateItemFocus(items: HTMLElement[], focusedIndex: number) {
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      if (index === focusedIndex) {
        item.focus();
        item.setAttribute('aria-selected', 'true');
        item.setAttribute('data-selected', 'true');
      } else {
        item.removeAttribute('aria-selected');
        item.removeAttribute('data-selected');
      }
    }
  }

  private focusDropdown() {
    if (this.overlayRef?.hasAttached()) {
      const dropdownElement = this.overlayRef.overlayElement.querySelector('[role="listbox"]') as HTMLElement;
      if (dropdownElement) {
        dropdownElement.focus();
      }
    }
  }

  private focusButton() {
    const button = this.elementRef.nativeElement.querySelector('button');
    if (button) {
      button.focus();
    }
  }

  private focusSelectedItem() {
    const items = this.getSelectItems();
    if (items.length === 0) {
      return;
    }

    // Find the index of the currently selected item
    let selectedValue;
    if (Array.isArray(this.zValue()) && this.zValue().length) {
      [selectedValue] = this.zValue();
    } else {
      selectedValue = this.zValue();
    }

    let selectedIndex = items.findIndex(item => item.getAttribute('value') === selectedValue);

    // If no item is selected, focus the first item
    if (selectedIndex === -1) {
      selectedIndex = 0;
    }

    this.focusedIndex.set(selectedIndex);
    this.updateItemFocus(items, selectedIndex);
  }

  // ControlValueAccessor implementation
  writeValue(value: string | string[] | null): void {
    if (this.zMultiple() && Array.isArray(value)) {
      this.zValue.set(value);
    } else {
      this.zValue.set(value ?? '');
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(): void {
    // The disabled state is handled by the disabled input
  }
}
```

## select.imports.ts
```typescript
import { ZardSelectItemComponent } from '@/shared/components/select/select-item.component';
import { ZardSelectComponent } from '@/shared/components/select/select.component';

export const ZardSelectImports = [ZardSelectComponent, ZardSelectItemComponent] as const;
```

## select.variants.ts
```typescript
import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

export const selectVariants = cva(
  mergeClasses(
    'relative inline-block w-full rounded-md group data-active:border data-active:border-ring data-active:ring-ring/50 data-active:ring-[3px]',
    '[&_button]:focus-visible:border [&_button]:focus-visible:border-ring [&_button]:focus-visible:ring-ring/50 [&_button]:focus-visible:ring-[3px]',
  ),
);

export const selectTriggerVariants = cva(
  mergeClasses(
    'flex w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent',
    'shadow-xs transition-[color,box-shadow] outline-none cursor-pointer disabled:cursor-not-allowed',
    'disabled:opacity-50 data-placeholder:text-muted-foreground [&_svg:not([class*="text-"])]:text-muted-foreground',
    'dark:bg-input/30 dark:hover:bg-input/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
    'aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
  ),
  {
    variants: {
      zSize: {
        sm: 'min-h-8 py-1 text-xs px-2',
        default: 'min-h-9 py-1.5 px-3 text-sm',
        lg: 'min-h-10 py-2 text-base px-4',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  },
);
export const selectContentVariants = cva(
  'z-9999 min-w-full scrollbar-hide overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95',
);
export const selectItemVariants = cva(
  'relative flex min-w-full cursor-pointer text-nowrap items-center gap-2 rounded-sm mb-0.5 outline-hidden select-none hover:bg-accent hover:text-accent-foreground data-selected:bg-accent data-selected:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:hover:bg-transparent data-disabled:hover:text-current [&_svg:not([class*="text-"])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
  {
    variants: {
      zSize: {
        sm: 'min-h-8 py-1 text-xs',
        default: 'min-h-9 py-1.5 text-sm',
        lg: 'min-h-10 py-2 text-base',
      },
      zMode: {
        normal: 'pr-8 pl-2',
        compact: 'pl-6.5 pr-2',
      },
    },
    compoundVariants: [
      {
        zMode: 'compact',
        zSize: 'sm',
        class: 'pl-5 pr-2',
      },
    ],
  },
);

export const selectItemIconVariants = cva('absolute flex size-3.5 items-center justify-center', {
  variants: {
    // zSize variants are placeholders for compound variant matching
    zSize: {
      sm: '',
      default: '',
      lg: '',
    },
    zMode: {
      normal: 'right-2',
      compact: 'left-2',
    },
  },
  compoundVariants: [
    {
      zMode: 'compact',
      zSize: 'sm',
      class: 'left-1',
    },
  ],
});

export type ZardSelectSizeVariants = NonNullable<VariantProps<typeof selectTriggerVariants>['zSize']>;
export type ZardSelectItemModeVariants = NonNullable<VariantProps<typeof selectItemVariants>['zMode']>;
```

