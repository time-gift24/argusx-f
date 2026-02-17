# dropdown-menu - zardui sources

## Directory
- demo (dir)
- doc (dir)
- dropdown-item.component.spec.ts (file)
- dropdown-item.component.ts (file)
- dropdown-menu-content.component.spec.ts (file)
- dropdown-menu-content.component.ts (file)
- dropdown-trigger.directive.spec.ts (file)
- dropdown-trigger.directive.ts (file)
- dropdown.component.spec.ts (file)
- dropdown.component.ts (file)
- dropdown.imports.ts (file)
- dropdown.service.spec.ts (file)
- dropdown.service.ts (file)
- dropdown.variants.ts (file)
- index.ts (file)

## dropdown-item.component.spec.ts
```typescript
import { Component } from '@angular/core';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { fakeAsync, flush, type ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardEventManagerPlugin } from '@/shared/core';

import { ZardDropdownMenuItemComponent } from './dropdown-item.component';
import { ZardDropdownService } from './dropdown.service';

@Component({
  imports: [ZardDropdownMenuItemComponent],
  template: `
    <z-dropdown-menu-item [variant]="variant" [inset]="inset" [disabled]="disabled">
      {{ text }}
    </z-dropdown-menu-item>
  `,
})
class TestComponent {
  variant: 'default' | 'destructive' = 'default';
  inset = false;
  disabled = false;
  text = 'Test Item';
}

describe('ZardDropdownMenuItemComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let dropdownService: jest.Mocked<ZardDropdownService>;

  beforeEach(async () => {
    const mockDropdownService = {
      close: jest.fn(),
      isOpen: jest.fn().mockReturnValue(false),
      toggle: jest.fn(),
    } as unknown as jest.Mocked<ZardDropdownService>;

    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        {
          provide: ZardDropdownService,
          useValue: mockDropdownService,
        },
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    dropdownService = TestBed.inject(ZardDropdownService) as jest.Mocked<ZardDropdownService>;
    fixture.detectChanges();

    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('sets menuitem role and tabindex', () => {
      const itemElement = fixture.nativeElement.querySelector('z-dropdown-menu-item');

      expect(itemElement).toBeTruthy();
      expect(itemElement).toHaveAttribute('role', 'menuitem');
      expect(itemElement).toHaveAttribute('tabindex', '-1');
    });

    it('displays text content', () => {
      const itemElement = fixture.nativeElement.querySelector('z-dropdown-menu-item');

      expect(itemElement.textContent).toContain('Test Item');
    });
  });

  describe('Disabled state', () => {
    it('sets data-disabled and aria-disabled when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();

      const itemElement = fixture.nativeElement.querySelector('z-dropdown-menu-item');
      expect(itemElement).toHaveAttribute('data-disabled');
      expect(itemElement).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not set data-disabled when enabled', () => {
      const itemElement = fixture.nativeElement.querySelector('z-dropdown-menu-item');
      expect(itemElement).not.toHaveAttribute('data-disabled');
      expect(itemElement).toHaveAttribute('aria-disabled', 'false');
    });
  });

  describe('Variant attribute', () => {
    it('sets data-variant to default', () => {
      component.variant = 'default';
      fixture.detectChanges();

      const itemElement = fixture.nativeElement.querySelector('z-dropdown-menu-item');
      expect(itemElement).toHaveAttribute('data-variant', 'default');
    });

    it('sets data-variant to destructive', () => {
      component.variant = 'destructive';
      fixture.detectChanges();

      const itemElement = fixture.nativeElement.querySelector('z-dropdown-menu-item');
      expect(itemElement).toHaveAttribute('data-variant', 'destructive');
    });
  });

  describe('Inset attribute', () => {
    it('sets data-inset when inset is true', () => {
      component.inset = true;
      fixture.detectChanges();

      const itemElement = fixture.nativeElement.querySelector('z-dropdown-menu-item');
      expect(itemElement).toHaveAttribute('data-inset');
    });

    it('does not set data-inset when inset is false', () => {
      const itemElement = fixture.nativeElement.querySelector('z-dropdown-menu-item');
      expect(itemElement).not.toHaveAttribute('data-inset');
    });
  });

  describe('Click handling', () => {
    it('calls dropdownService.close() on click when enabled', fakeAsync(() => {
      const itemDebugElement = fixture.debugElement.children[0];
      const itemComponent = itemDebugElement.componentInstance as ZardDropdownMenuItemComponent;
      itemComponent.onClick();
      flush();

      expect(dropdownService.close).toHaveBeenCalled();
    }));

    it('does not call dropdownService.close() on click when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();

      const itemDebugElement = fixture.debugElement.children[0];
      const itemComponent = itemDebugElement.componentInstance as ZardDropdownMenuItemComponent;
      itemComponent.onClick();

      expect(dropdownService.close).not.toHaveBeenCalled();
    });
  });

  describe('Styling classes', () => {
    it('applies destructive variant classes', () => {
      component.variant = 'destructive';
      fixture.detectChanges();

      const itemElement = fixture.nativeElement.querySelector('z-dropdown-menu-item');
      expect(Array.from(itemElement.classList as DOMTokenList).some(c => c.includes('destruct'))).toBe(true);
    });

    it('applies inset padding classes when inset is true', () => {
      component.inset = true;
      fixture.detectChanges();

      const itemElement = fixture.nativeElement.querySelector('z-dropdown-menu-item');
      expect(
        Array.from(itemElement.classList as DOMTokenList).some(c => c.startsWith('pl-') || c.includes('inset')),
      ).toBe(true);
    });
  });
});

describe('ZardDropdownMenuItemComponent standalone', () => {
  let component: ZardDropdownMenuItemComponent;
  let fixture: ComponentFixture<ZardDropdownMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardDropdownMenuItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardDropdownMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('initializes component successfully', () => {
    expect(component).toBeTruthy();
  });

  it('applies custom class input', () => {
    fixture.componentRef.setInput('class', 'custom-class');
    fixture.detectChanges();

    const element = fixture.nativeElement;
    expect(element).toHaveClass('custom-class');
  });
});
```

## dropdown-item.component.ts
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

import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardDropdownService } from './dropdown.service';
import { dropdownItemVariants, type ZardDropdownItemVariants } from './dropdown.variants';

@Component({
  selector: 'z-dropdown-menu-item, [z-dropdown-menu-item]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    '[attr.data-disabled]': 'disabled() || null',
    '[attr.data-variant]': 'variant()',
    '[attr.data-inset]': 'inset() || null',
    '[attr.aria-disabled]': 'disabled()',
    '(click.prevent-with-stop)': 'onClick()',
    role: 'menuitem',
    tabindex: '-1',
  },
  exportAs: 'zDropdownMenuItem',
})
export class ZardDropdownMenuItemComponent {
  private readonly dropdownService = inject(ZardDropdownService);

  readonly variant = input<ZardDropdownItemVariants['variant']>('default');
  readonly inset = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly class = input<ClassValue>('');

  onClick() {
    if (this.disabled()) {
      return;
    }

    // Fechar dropdown após click
    setTimeout(() => {
      this.dropdownService.close();
    }, 0);
  }

  protected readonly classes = computed(() =>
    mergeClasses(
      dropdownItemVariants({
        variant: this.variant(),
        inset: this.inset(),
      }),
      this.class(),
    ),
  );
}
```

## dropdown-menu-content.component.spec.ts
```typescript
import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardDropdownMenuContentComponent } from './dropdown-menu-content.component';

@Component({
  imports: [ZardDropdownMenuContentComponent],
  standalone: true,
  template: `
    <z-dropdown-menu-content [class]="customClass">
      <div>Menu Content</div>
    </z-dropdown-menu-content>
  `,
})
class TestComponent {
  customClass = '';
}

describe('ZardDropdownMenuContentComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('initializes component successfully', () => {
    expect(component).toBeTruthy();
  });

  it('hides content with display none', () => {
    const contentElement = fixture.nativeElement.querySelector('z-dropdown-menu-content');
    expect(contentElement).toHaveStyle({ display: 'none' });
  });

  it('receives custom class input', () => {
    const dropdownContentEl = fixture.debugElement.children[0];
    const dropdownContentComponent = dropdownContentEl.componentInstance;

    component.customClass = 'test-class';
    fixture.detectChanges();

    expect(dropdownContentComponent.class()).toBe('test-class');
  });
});

describe('ZardDropdownMenuContentComponent standalone', () => {
  let component: ZardDropdownMenuContentComponent;
  let fixture: ComponentFixture<ZardDropdownMenuContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardDropdownMenuContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardDropdownMenuContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('initializes component successfully', () => {
    expect(component).toBeTruthy();
  });

  it('exposes contentTemplate', () => {
    expect(component.contentTemplate).toBeTruthy();
  });

  it('exports as zDropdownMenuContent', () => {
    expect(fixture.componentInstance).toBeInstanceOf(ZardDropdownMenuContentComponent);
  });
});
```

## dropdown-menu-content.component.ts
```typescript
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  type TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { dropdownContentVariants } from '@/shared/components/dropdown/dropdown.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-dropdown-menu-content',
  template: `
    <ng-template #contentTemplate>
      <div [class]="contentClasses()" role="menu" tabindex="-1" aria-orientation="vertical">
        <ng-content />
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[style.display]': '"none"',
  },
  exportAs: 'zDropdownMenuContent',
})
export class ZardDropdownMenuContentComponent {
  readonly contentTemplate = viewChild.required<TemplateRef<unknown>>('contentTemplate');

  readonly class = input<ClassValue>('');

  protected readonly contentClasses = computed(() => mergeClasses(dropdownContentVariants(), this.class()));
}
```

## dropdown-trigger.directive.spec.ts
```typescript
import { Component, viewChild, ElementRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardEventManagerPlugin } from '@/shared/core';

import { ZardDropdownMenuContentComponent } from './dropdown-menu-content.component';
import { ZardDropdownDirective } from './dropdown-trigger.directive';
import { ZardDropdownService } from './dropdown.service';

@Component({
  imports: [ZardDropdownDirective, ZardDropdownMenuContentComponent],
  template: `
    <button
      type="button"
      z-dropdown
      [zDropdownMenu]="menuContent"
      [zTrigger]="triggerMode"
      [zDisabled]="disabled"
      aria-label="Open menu"
      data-testid="dropdown-trigger"
    >
      Menu
    </button>

    <z-dropdown-menu-content #menuContent>
      <div>Menu Item 1</div>
      <div>Menu Item 2</div>
    </z-dropdown-menu-content>
  `,
})
class TestComponent {
  triggerMode: 'click' | 'hover' = 'click';
  disabled = false;
  readonly menuContent = viewChild.required<ZardDropdownMenuContentComponent>('menuContent');
}

describe('ZardDropdownDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let dropdownService: jest.Mocked<ZardDropdownService>;
  let mockIsOpenFn: jest.Mock;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockIsOpenFn = jest.fn().mockReturnValue(false);

    const mockDropdownService = {
      isOpen: mockIsOpenFn,
      toggle: jest.fn(),
      close: jest.fn(),
    } as unknown as jest.Mocked<ZardDropdownService>;

    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
        {
          provide: ZardDropdownService,
          useValue: mockDropdownService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    dropdownService = TestBed.inject(ZardDropdownService) as jest.Mocked<ZardDropdownService>;
    fixture.detectChanges();
  });

  describe('Accessibility attributes', () => {
    it('sets tabindex role aria-haspopup and aria-expanded', () => {
      const triggerElement = fixture.nativeElement.querySelector('button');

      expect(triggerElement).toHaveAttribute('tabindex', '0');
      expect(triggerElement).toHaveAttribute('role', 'button');
      expect(triggerElement).toHaveAttribute('aria-haspopup', 'menu');
      expect(triggerElement).toHaveAttribute('aria-expanded', 'false');
    });

    it('reflects disabled state in aria-disabled', () => {
      expect(component.disabled).toBe(false);

      component.disabled = true;
      fixture.detectChanges();

      const triggerElement = fixture.nativeElement.querySelector('button');
      expect(triggerElement).toHaveAttribute('aria-disabled', 'true');
    });

    it('uses aria-label from host attribute', () => {
      const triggerElement = fixture.nativeElement.querySelector('button');

      expect(triggerElement).toHaveAttribute('aria-label', 'Open menu');
    });
  });

  describe('Click trigger mode', () => {
    it('calls toggle on click event', () => {
      const triggerElement = fixture.nativeElement.querySelector('button');
      triggerElement.click();

      expect(dropdownService.toggle).toHaveBeenCalled();
    });

    it('ignores clicks when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();

      const triggerElement = fixture.nativeElement.querySelector('button');
      triggerElement.click();

      expect(dropdownService.toggle).not.toHaveBeenCalled();
    });
  });

  describe('Hover trigger mode', () => {
    beforeEach(() => {
      component.triggerMode = 'hover';
      fixture.detectChanges();
    });

    it('calls openDropdown on mouseenter event', () => {
      mockIsOpenFn.mockReturnValue(false);
      const triggerElement = fixture.nativeElement.querySelector('button');
      triggerElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

      expect(dropdownService.toggle).toHaveBeenCalled();
    });

    it('does not call openDropdown on mouseenter when already open', () => {
      mockIsOpenFn.mockReturnValue(true);
      const triggerElement = fixture.nativeElement.querySelector('button');
      triggerElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

      expect(dropdownService.toggle).not.toHaveBeenCalled();
    });

    it('calls closeDropdown on mouseleave event', () => {
      const triggerElement = fixture.nativeElement.querySelector('button');
      triggerElement.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));

      expect(dropdownService.close).toHaveBeenCalled();
    });

    it('ignores hover events when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();

      const triggerElement = fixture.nativeElement.querySelector('button');
      triggerElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

      expect(dropdownService.toggle).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard navigation', () => {
    it('opens dropdown on Enter keydown', () => {
      mockIsOpenFn.mockReturnValue(false);
      const triggerElement = fixture.nativeElement.querySelector('button');
      triggerElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(dropdownService.toggle).toHaveBeenCalled();
    });

    it('opens dropdown on Space keydown', () => {
      mockIsOpenFn.mockReturnValue(false);
      const triggerElement = fixture.nativeElement.querySelector('button');
      triggerElement.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

      expect(dropdownService.toggle).toHaveBeenCalled();
    });

    it('opens dropdown on ArrowDown keydown', () => {
      mockIsOpenFn.mockReturnValue(false);
      const triggerElement = fixture.nativeElement.querySelector('button');
      triggerElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

      expect(dropdownService.toggle).toHaveBeenCalled();
    });

    it('ignores keyboard events when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();

      const triggerElement = fixture.nativeElement.querySelector('button');
      triggerElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(dropdownService.toggle).not.toHaveBeenCalled();
    });

    it('toggles dropdown on Enter when already open', () => {
      mockIsOpenFn.mockReturnValue(true);
      const triggerElement = fixture.nativeElement.querySelector('button');
      triggerElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(dropdownService.toggle).toHaveBeenCalled();
    });

    it('toggles dropdown on Space when already open', () => {
      mockIsOpenFn.mockReturnValue(true);
      const triggerElement = fixture.nativeElement.querySelector('button');
      triggerElement.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

      expect(dropdownService.toggle).toHaveBeenCalled();
    });
  });

  describe('Service integration', () => {
    it('passes correct parameters to toggle method', () => {
      mockIsOpenFn.mockReturnValue(false);
      const triggerElement = fixture.nativeElement.querySelector('button');
      triggerElement.click();

      expect(dropdownService.toggle).toHaveBeenCalledWith(
        expect.any(ElementRef),
        expect.any(TemplateRef),
        expect.any(ViewContainerRef),
      );
    });
  });

  describe('Directive export', () => {
    it('exports as zDropdown', () => {
      const directiveElement = fixture.debugElement.children[0];
      const directiveInstance = directiveElement.injector.get(ZardDropdownDirective);

      expect(directiveInstance).toBeTruthy();
      expect(directiveInstance).toBeInstanceOf(ZardDropdownDirective);
    });
  });

  describe('Input bindings', () => {
    it('receives zDropdownMenu input correctly', () => {
      const directiveElement = fixture.debugElement.children[0];
      const directiveInstance = directiveElement.injector.get(ZardDropdownDirective);

      expect(directiveInstance.zDropdownMenu()).toBeTruthy();
    });

    it('accepts click and hover trigger modes', () => {
      const directiveElement = fixture.debugElement.children[0];
      const directiveInstance = directiveElement.injector.get(ZardDropdownDirective);

      component.triggerMode = 'click';
      fixture.detectChanges();
      expect(directiveInstance.zTrigger()).toBe('click');

      component.triggerMode = 'hover';
      fixture.detectChanges();
      expect(directiveInstance.zTrigger()).toBe('hover');
    });

    it('accepts boolean for disabled state', () => {
      const directiveElement = fixture.debugElement.children[0];
      const directiveInstance = directiveElement.injector.get(ZardDropdownDirective);

      component.disabled = false;
      fixture.detectChanges();
      expect(directiveInstance.zDisabled()).toBe(false);

      component.disabled = true;
      fixture.detectChanges();
      expect(directiveInstance.zDisabled()).toBe(true);
    });
  });
});
```

## dropdown-trigger.directive.ts
```typescript
import { Directive, ElementRef, inject, input, type OnInit, ViewContainerRef } from '@angular/core';

import type { ZardDropdownMenuContentComponent } from './dropdown-menu-content.component';
import { ZardDropdownService } from './dropdown.service';

@Directive({
  selector: '[z-dropdown], [zDropdown]',
  host: {
    '[attr.tabindex]': '0',
    '[attr.role]': '"button"',
    '[attr.aria-haspopup]': '"menu"',
    '[attr.aria-expanded]': 'dropdownService.isOpen()',
    '[attr.aria-disabled]': 'zDisabled()',
    '(click.prevent-with-stop)': 'onClick()',
    '(mouseenter)': 'onHoverToggle($event)',
    '(mouseleave)': 'onHoverToggle($event)',
    '(keydown.{enter,space}.prevent-with-stop)': 'toggleDropdown()',
    '(keydown.arrowdown.prevent)': 'openDropdown()',
  },
  exportAs: 'zDropdown',
})
export class ZardDropdownDirective implements OnInit {
  private readonly elementRef = inject(ElementRef);
  private readonly viewContainerRef = inject(ViewContainerRef);
  protected readonly dropdownService = inject(ZardDropdownService);

  readonly zDropdownMenu = input<ZardDropdownMenuContentComponent>();
  readonly zTrigger = input<'click' | 'hover'>('click');
  readonly zDisabled = input<boolean>(false);

  ngOnInit() {
    // Ensure button has proper accessibility attributes
    const element = this.elementRef.nativeElement;
    if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
      const label = element.textContent?.trim();
      element.setAttribute('aria-label', label?.length ? label : 'Open menu');
    }
  }

  protected onClick() {
    if (this.zTrigger() !== 'click') {
      return;
    }

    this.toggleDropdown();
  }

  protected onHoverToggle(event: MouseEvent) {
    if (this.zTrigger() !== 'hover' || this.zDisabled()) {
      return;
    }

    if (event.type === 'mouseenter') {
      this.openDropdown();
    } else if (event.type === 'mouseleave') {
      this.closeDropdown();
    }
  }

  protected toggleDropdown() {
    if (this.zDisabled()) {
      return;
    }

    const menuContent = this.zDropdownMenu();
    if (menuContent) {
      this.dropdownService.toggle(this.elementRef, menuContent.contentTemplate(), this.viewContainerRef);
    }
  }

  protected openDropdown() {
    if (this.zDisabled()) {
      return;
    }

    const menuContent = this.zDropdownMenu();
    if (menuContent && !this.dropdownService.isOpen()) {
      this.dropdownService.toggle(this.elementRef, menuContent.contentTemplate(), this.viewContainerRef);
    }
  }

  protected closeDropdown() {
    this.dropdownService.close();
  }
}
```

## dropdown.component.spec.ts
```typescript
import { OverlayModule } from '@angular/cdk/overlay';
import { Component, type DebugElement } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By, EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardEventManagerPlugin } from '@/shared/core';

import { ZardDropdownMenuComponent } from './dropdown.component';

@Component({
  imports: [ZardDropdownMenuComponent],
  template: `
    <z-dropdown-menu [disabled]="disabled" [class]="customClass">
      <div dropdown-trigger>Trigger</div>
      <div z-dropdown-menu-item>Item 1</div>
      <div z-dropdown-menu-item>Item 2</div>
    </z-dropdown-menu>
  `,
})
class TestComponent {
  disabled = false;
  customClass = '';
}

@Component({
  imports: [ZardDropdownMenuComponent],
  template: `
    <z-dropdown-menu (openChange)="onOpenChange($event)">
      <div dropdown-trigger>Trigger</div>
      <div z-dropdown-menu-item>Item 1</div>
      <div z-dropdown-menu-item>Item 2</div>
    </z-dropdown-menu>
  `,
})
class OpenChangeOutputTestComponent {
  openChangeEmitted = false;
  lastOpenState = false;

  onOpenChange(isOpen: boolean) {
    this.openChangeEmitted = true;
    this.lastOpenState = isOpen;
  }
}

@Component({
  imports: [ZardDropdownMenuComponent],
  template: `
    <z-dropdown-menu #dropdown="zDropdownMenu">
      <div dropdown-trigger>Trigger</div>
      <div z-dropdown-menu-item>Item 1</div>
      <div z-dropdown-menu-item>Item 2</div>
    </z-dropdown-menu>
  `,
})
class TemplateRefTestComponent {}

function configureDropdownTestBed() {
  return TestBed.configureTestingModule({
    imports: [OverlayModule],
    providers: [
      {
        provide: EVENT_MANAGER_PLUGINS,
        useClass: ZardEventManagerPlugin,
        multi: true,
      },
    ],
  }).compileComponents();
}

function cleanupOverlay() {
  const overlayContainer = document.querySelector('.cdk-overlay-container');
  if (overlayContainer) {
    overlayContainer.innerHTML = '';
  }
}

describe('ZardDropdownMenuComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let dropdownEl: DebugElement;

  beforeEach(async () => {
    await configureDropdownTestBed();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    dropdownEl = fixture.debugElement.query(By.css('z-dropdown-menu'));
    fixture.detectChanges();
  });

  afterEach(() => {
    cleanupOverlay();
  });

  describe('Initialization', () => {
    it('initializes component successfully', () => {
      expect(component).toBeTruthy();
    });

    it('sets correct host classes', () => {
      const hostElement = dropdownEl.nativeElement;
      expect(hostElement).toHaveClass('relative', 'inline-block', 'text-left');
    });

    it('sets initial data-state to closed', () => {
      const hostElement = dropdownEl.nativeElement;
      expect(hostElement.getAttribute('data-state')).toBe('closed');
    });

    it('renders trigger container', () => {
      const trigger = fixture.nativeElement.querySelector('.trigger-container');
      expect(trigger).toBeTruthy();
    });

    it('renders dropdown trigger content', () => {
      const trigger = fixture.nativeElement.querySelector('.trigger-container');
      expect(trigger.textContent).toContain('Trigger');
    });
  });

  describe('Toggle functionality', () => {
    it('opens dropdown on trigger click', () => {
      const trigger = fixture.nativeElement.querySelector('.trigger-container');

      trigger.click();
      fixture.detectChanges();

      expect(dropdownEl.componentInstance.isOpen()).toBe(true);
      expect(dropdownEl.nativeElement.getAttribute('data-state')).toBe('open');
    });

    it('closes dropdown when clicking trigger again', () => {
      const trigger = fixture.nativeElement.querySelector('.trigger-container');

      trigger.click();
      fixture.detectChanges();

      trigger.click();
      fixture.detectChanges();

      expect(dropdownEl.componentInstance.isOpen()).toBe(false);
      expect(dropdownEl.nativeElement.getAttribute('data-state')).toBe('closed');
    });

    it('can be toggled programmatically', () => {
      dropdownEl.componentInstance.open();
      fixture.detectChanges();

      expect(dropdownEl.componentInstance.isOpen()).toBe(true);

      dropdownEl.componentInstance.close();
      fixture.detectChanges();

      expect(dropdownEl.componentInstance.isOpen()).toBe(false);
    });
  });

  describe('Disabled state', () => {
    it('does not open when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector('.trigger-container');
      trigger.click();
      fixture.detectChanges();

      expect(dropdownEl.componentInstance.isOpen()).toBe(false);
    });

    it('does not open on Enter key when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector('.trigger-container');
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
      fixture.detectChanges();

      expect(dropdownEl.componentInstance.isOpen()).toBe(false);
    });

    it('toggles dropdown on Enter key when not disabled', () => {
      component.disabled = false;
      fixture.detectChanges();

      const toggleSpy = jest.spyOn(dropdownEl.componentInstance, 'toggle');
      const trigger = fixture.nativeElement.querySelector('.trigger-container');
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
      fixture.detectChanges();

      expect(toggleSpy).toHaveBeenCalled();
    });

    it('toggles dropdown on Space key when not disabled', () => {
      component.disabled = false;
      fixture.detectChanges();

      const toggleSpy = jest.spyOn(dropdownEl.componentInstance, 'toggle');
      const trigger = fixture.nativeElement.querySelector('.trigger-container');
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
      fixture.detectChanges();

      expect(toggleSpy).toHaveBeenCalled();
    });
  });

  describe('Document click to close', () => {
    it('closes dropdown when clicking outside', () => {
      const trigger = fixture.nativeElement.querySelector('.trigger-container');

      trigger.click();
      fixture.detectChanges();

      expect(dropdownEl.componentInstance.isOpen()).toBe(true);

      document.body.click();
      fixture.detectChanges();

      expect(dropdownEl.componentInstance.isOpen()).toBe(false);
    });
  });

  describe('Custom classes', () => {
    it('applies custom class to dropdown content', async () => {
      component.customClass = 'custom-dropdown';
      fixture.detectChanges();

      const dropdownMenu = dropdownEl.componentInstance;
      expect(dropdownMenu.class()).toBe('custom-dropdown');

      const trigger = fixture.nativeElement.querySelector('.trigger-container');
      trigger.click();
      await fixture.whenStable();
      fixture.detectChanges();

      const overlayContainer = document.querySelector('.cdk-overlay-container');
      const overlayContent = overlayContainer?.querySelector('[role="menu"]');
      expect(overlayContent?.classList).toContain('custom-dropdown');
    });
  });

  describe('Keyboard navigation within dropdown', () => {
    it('has role="menu" on dropdown content', async () => {
      const trigger = fixture.nativeElement.querySelector('.trigger-container');

      trigger.click();
      await fixture.whenStable();
      fixture.detectChanges();

      const overlayContainer = document.querySelector('.cdk-overlay-container');
      const menuElement = overlayContainer?.querySelector('[role="menu"]');
      expect(menuElement).toBeTruthy();
    });

    it('moves focus to next item with ArrowDown', async () => {
      const trigger = fixture.nativeElement.querySelector('.trigger-container');
      trigger.click();
      await new Promise(resolve => setTimeout(resolve, 10));
      fixture.detectChanges();

      const overlayContainer = document.querySelector('.cdk-overlay-container');
      const menuElement = overlayContainer?.querySelector('[role="menu"]');
      expect(menuElement).toBeTruthy();
      menuElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
      fixture.detectChanges();

      const menuItems = overlayContainer?.querySelectorAll<HTMLElement>('[z-dropdown-menu-item]');
      expect(menuItems?.[1]?.hasAttribute('data-highlighted')).toBe(true);
    });

    it('moves focus to previous item with ArrowUp', async () => {
      const trigger = fixture.nativeElement.querySelector('.trigger-container');
      trigger.click();
      await new Promise(resolve => setTimeout(resolve, 10));
      fixture.detectChanges();

      const overlayContainer = document.querySelector('.cdk-overlay-container');
      const menuElement = overlayContainer?.querySelector('[role="menu"]');
      expect(menuElement).toBeTruthy();
      menuElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
      menuElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }));
      fixture.detectChanges();

      const menuItems = overlayContainer?.querySelectorAll<HTMLElement>('[z-dropdown-menu-item]');
      expect(menuItems?.[0]?.hasAttribute('data-highlighted')).toBe(true);
    });

    it('closes dropdown with Escape key', async () => {
      const trigger = fixture.nativeElement.querySelector('.trigger-container');
      trigger.click();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(dropdownEl.componentInstance.isOpen()).toBe(true);

      const overlayContainer = document.querySelector('.cdk-overlay-container');
      const menuElement = overlayContainer?.querySelector('[role="menu"]');
      expect(menuElement).toBeTruthy();
      menuElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
      fixture.detectChanges();

      expect(dropdownEl.componentInstance.isOpen()).toBe(false);
    });

    it('focuses first item with Home key', async () => {
      const trigger = fixture.nativeElement.querySelector('.trigger-container');
      trigger.click();
      await new Promise(resolve => setTimeout(resolve, 10));
      fixture.detectChanges();

      const overlayContainer = document.querySelector('.cdk-overlay-container');
      const menuElement = overlayContainer?.querySelector('[role="menu"]');
      expect(menuElement).toBeTruthy();
      menuElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
      menuElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
      menuElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true, cancelable: true }));
      fixture.detectChanges();

      const menuItems = overlayContainer?.querySelectorAll<HTMLElement>('[z-dropdown-menu-item]');
      expect(menuItems?.[0]?.hasAttribute('data-highlighted')).toBe(true);
    });

    it('focuses last item with End key', async () => {
      const trigger = fixture.nativeElement.querySelector('.trigger-container');
      trigger.click();
      await new Promise(resolve => setTimeout(resolve, 10));
      fixture.detectChanges();

      const overlayContainer = document.querySelector('.cdk-overlay-container');
      const menuElement = overlayContainer?.querySelector('[role="menu"]');
      expect(menuElement).toBeTruthy();
      menuElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
      menuElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true }));
      fixture.detectChanges();

      const menuItems = overlayContainer?.querySelectorAll<HTMLElement>('[z-dropdown-menu-item]');
      expect(menuItems?.[menuItems.length - 1]?.hasAttribute('data-highlighted')).toBe(true);
    });
  });

  describe('Lifecycle hooks', () => {
    it('initializes with closed state', async () => {
      const dropdownMenu = dropdownEl.componentInstance;

      await fixture.whenStable();
      fixture.detectChanges();

      expect(dropdownMenu.isOpen()).toBe(false);
    });
  });
});

describe('ZardDropdownMenuComponent with openChange output', () => {
  let fixture: ComponentFixture<OpenChangeOutputTestComponent>;

  beforeEach(async () => {
    await configureDropdownTestBed();

    fixture = TestBed.createComponent(OpenChangeOutputTestComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    cleanupOverlay();
  });

  it('emits true when dropdown opens', () => {
    const trigger = fixture.nativeElement.querySelector('.trigger-container');

    trigger.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.openChangeEmitted).toBe(true);
    expect(fixture.componentInstance.lastOpenState).toBe(true);
  });

  it('emits false when dropdown closes', () => {
    const trigger = fixture.nativeElement.querySelector('.trigger-container');

    trigger.click();
    fixture.detectChanges();

    trigger.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.openChangeEmitted).toBe(true);
    expect(fixture.componentInstance.lastOpenState).toBe(false);
  });
});

describe('ZardDropdownMenuComponent via TestComponent host', () => {
  let dropdownMenu: ZardDropdownMenuComponent;
  let testComponent: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let dropdownEl: DebugElement;

  beforeEach(async () => {
    await configureDropdownTestBed();

    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;
    dropdownEl = fixture.debugElement.query(By.css('z-dropdown-menu'));
    dropdownMenu = dropdownEl.componentInstance as ZardDropdownMenuComponent;
    fixture.detectChanges();
  });

  afterEach(() => {
    cleanupOverlay();
  });

  it('exports as zDropdownMenu', () => {
    const templateRefFixture = TestBed.createComponent(TemplateRefTestComponent);
    templateRefFixture.detectChanges();

    const templateDropdownEl = templateRefFixture.debugElement.query(By.css('z-dropdown-menu'));
    const templateRef = templateDropdownEl.references['dropdown'] as ZardDropdownMenuComponent;
    const templateRefComponent = templateDropdownEl.componentInstance as ZardDropdownMenuComponent;

    expect(templateRef).toBe(templateRefComponent);
    expect(templateRef).toBeInstanceOf(ZardDropdownMenuComponent);
  });

  it('applies custom class input', () => {
    testComponent.customClass = 'custom-class';
    fixture.detectChanges();

    expect(dropdownMenu.class()).toBe('custom-class');
  });

  it('sets disabled input', () => {
    testComponent.disabled = true;
    fixture.detectChanges();

    expect(dropdownMenu.disabled()).toBe(true);
  });

  it('toggles open state with open method', () => {
    dropdownMenu.open();
    fixture.detectChanges();

    expect(dropdownMenu.isOpen()).toBe(true);

    dropdownMenu.close();
    fixture.detectChanges();

    expect(dropdownMenu.isOpen()).toBe(false);
  });

  it('toggles with toggle method', () => {
    dropdownMenu.toggle();
    fixture.detectChanges();

    expect(dropdownMenu.isOpen()).toBe(true);

    dropdownMenu.toggle();
    fixture.detectChanges();

    expect(dropdownMenu.isOpen()).toBe(false);
  });
});
```

## dropdown.component.ts
```typescript
import { Overlay, OverlayModule, OverlayPositionBuilder, type OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  type OnDestroy,
  output,
  PLATFORM_ID,
  signal,
  type TemplateRef,
  viewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { dropdownContentVariants } from './dropdown.variants';

@Component({
  selector: 'z-dropdown-menu',
  imports: [OverlayModule],
  template: `
    <!-- Dropdown Trigger -->
    <div class="trigger-container" (click)="toggle()" (keydown.{enter,space}.prevent)="toggle()" tabindex="0">
      <ng-content select="[dropdown-trigger]" />
    </div>

    <!-- Template for overlay content -->
    <ng-template #dropdownTemplate>
      <div
        [class]="contentClasses()"
        role="menu"
        [attr.data-state]="'open'"
        (keydown.{arrowdown,arrowup,enter,space,escape,home,end}.prevent)="onDropdownKeydown($event)"
        tabindex="-1"
      >
        <ng-content />
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'relative inline-block text-left',
    '[attr.data-state]': 'isOpen() ? "open" : "closed"',
    '(document:click)': 'onDocumentClick($event)',
  },
  exportAs: 'zDropdownMenu',
})
export class ZardDropdownMenuComponent implements OnDestroy {
  private elementRef = inject(ElementRef);
  private overlay = inject(Overlay);
  private overlayPositionBuilder = inject(OverlayPositionBuilder);
  private viewContainerRef = inject(ViewContainerRef);
  private platformId = inject(PLATFORM_ID);

  readonly dropdownTemplate = viewChild.required<TemplateRef<unknown>>('dropdownTemplate');

  private overlayRef?: OverlayRef;
  private portal?: TemplatePortal;

  readonly class = input<ClassValue>('');
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly openChange = output<boolean>();

  readonly isOpen = signal(false);
  readonly focusedIndex = signal<number>(-1);

  protected readonly contentClasses = computed(() => mergeClasses(dropdownContentVariants(), this.class()));

  ngOnDestroy() {
    this.destroyOverlay();
  }

  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  onDropdownKeydown(e: Event) {
    const items = this.getDropdownItems();
    const { key } = e as KeyboardEvent;

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
        this.focusTrigger();
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
    if (this.disabled()) {
      return;
    }
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (this.isOpen()) {
      return;
    }

    if (!this.overlayRef) {
      this.createOverlay();
    }

    if (!this.overlayRef) {
      return;
    }

    this.portal = new TemplatePortal(this.dropdownTemplate(), this.viewContainerRef);
    this.overlayRef.attach(this.portal);
    this.isOpen.set(true);
    this.openChange.emit(true);

    setTimeout(() => {
      this.focusDropdown();
      this.focusFirstItem(this.getDropdownItems());
    }, 0);
  }

  close() {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
    this.isOpen.set(false);
    this.focusedIndex.set(-1);
    this.openChange.emit(false);
  }

  private createOverlay() {
    if (this.overlayRef) {
      return;
    }

    if (isPlatformBrowser(this.platformId)) {
      try {
        const positionStrategy = this.overlayPositionBuilder
          .flexibleConnectedTo(this.elementRef)
          .withPositions([
            {
              originX: 'start',
              originY: 'bottom',
              overlayX: 'start',
              overlayY: 'top',
              offsetY: 4,
            },
            {
              originX: 'start',
              originY: 'top',
              overlayX: 'start',
              overlayY: 'bottom',
              offsetY: -4,
            },
          ])
          .withPush(false);

        this.overlayRef = this.overlay.create({
          positionStrategy,
          hasBackdrop: false,
          scrollStrategy: this.overlay.scrollStrategies.reposition(),
          minWidth: 200,
          maxHeight: 400,
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

  private getDropdownItems(): HTMLElement[] {
    if (!this.overlayRef?.hasAttached()) {
      return [];
    }
    const dropdownElement = this.overlayRef.overlayElement;
    return Array.from(
      dropdownElement.querySelectorAll<HTMLElement>('z-dropdown-menu-item, [z-dropdown-menu-item]'),
    ).filter(item => item.dataset['disabled'] === undefined);
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
      item.click();
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
    items.forEach((item, index) => {
      if (index === focusedIndex) {
        item.focus();
        item.setAttribute('data-highlighted', '');
      } else {
        item.removeAttribute('data-highlighted');
      }
    });
  }

  private focusDropdown() {
    if (this.overlayRef?.hasAttached()) {
      const dropdownElement = this.overlayRef.overlayElement.querySelector('[role="menu"]') as HTMLElement;
      if (dropdownElement) {
        dropdownElement.focus();
      }
    }
  }

  private focusTrigger() {
    const trigger = this.elementRef.nativeElement.querySelector('.trigger-container');
    if (trigger) {
      trigger.focus();
    }
  }
}
```

## dropdown.imports.ts
```typescript
import { ZardDropdownMenuItemComponent } from '@/shared/components/dropdown/dropdown-item.component';
import { ZardDropdownMenuContentComponent } from '@/shared/components/dropdown/dropdown-menu-content.component';
import { ZardDropdownDirective } from '@/shared/components/dropdown/dropdown-trigger.directive';
import { ZardDropdownMenuComponent } from '@/shared/components/dropdown/dropdown.component';
import { ZardMenuLabelComponent } from '@/shared/components/menu/menu-label.component';

export const ZardDropdownImports = [
  ZardDropdownMenuComponent,
  ZardDropdownMenuItemComponent,
  ZardMenuLabelComponent,
  ZardDropdownMenuContentComponent,
  ZardDropdownDirective,
] as const;
```

## dropdown.service.spec.ts
```typescript
import { Overlay, OverlayPositionBuilder, type OverlayRef } from '@angular/cdk/overlay';
import {
  ElementRef,
  PLATFORM_ID,
  type Renderer2,
  RendererFactory2,
  type TemplateRef,
  type ViewContainerRef,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ZardDropdownService } from './dropdown.service';

describe('ZardDropdownService', () => {
  let service: ZardDropdownService;
  let mockOverlay: jest.Mocked<Overlay>;
  let mockOverlayRef: jest.Mocked<OverlayRef & { overlayElement: HTMLElement }>;
  let mockOverlayPositionBuilder: jest.Mocked<OverlayPositionBuilder>;
  let mockPositionStrategy: jest.Mocked<unknown>;
  let mockRendererFactory: jest.Mocked<RendererFactory2>;
  let mockRenderer: jest.Mocked<Renderer2>;
  let mockUnlistenFn: jest.Mock;

  beforeEach(() => {
    mockPositionStrategy = {
      apply: jest.fn(),
    } as unknown as jest.Mocked<unknown>;

    mockOverlayRef = {
      attach: jest.fn(),
      detach: jest.fn(),
      dispose: jest.fn(),
      hasAttached: jest.fn().mockReturnValue(true),
      outsidePointerEvents: jest.fn().mockReturnValue({
        pipe: jest.fn().mockReturnValue({
          subscribe: jest.fn().mockReturnValue({
            unsubscribe: jest.fn(),
          }),
        }),
      }),
      overlayElement: document.createElement('div'),
    } as unknown as jest.Mocked<OverlayRef & { overlayElement: HTMLElement }>;

    mockOverlayPositionBuilder = {
      flexibleConnectedTo: jest.fn().mockReturnValue({
        withPositions: jest.fn().mockReturnValue({
          withPush: jest.fn().mockReturnValue(mockPositionStrategy),
        }),
      }),
    } as unknown as jest.Mocked<OverlayPositionBuilder>;

    mockOverlay = {
      create: jest.fn().mockReturnValue(mockOverlayRef),
      scrollStrategies: {
        reposition: jest.fn().mockReturnValue({}),
      },
    } as unknown as jest.Mocked<Overlay>;

    mockUnlistenFn = jest.fn();
    mockRenderer = {
      listen: jest.fn().mockReturnValue(mockUnlistenFn),
      destroy: jest.fn(),
    } as unknown as jest.Mocked<Renderer2>;

    mockRendererFactory = {
      createRenderer: jest.fn().mockReturnValue(mockRenderer),
    } as unknown as jest.Mocked<RendererFactory2>;

    TestBed.configureTestingModule({
      providers: [
        ZardDropdownService,
        { provide: Overlay, useValue: mockOverlay },
        { provide: OverlayPositionBuilder, useValue: mockOverlayPositionBuilder },
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: RendererFactory2, useValue: mockRendererFactory },
      ],
    });

    service = TestBed.inject(ZardDropdownService);
  });

  it('creates the service', () => {
    expect(service).toBeTruthy();
    expect(service.isOpen()).toBe(false);
  });

  describe('toggle', () => {
    let triggerElement: ElementRef;
    let templateRef: TemplateRef<unknown>;
    let viewContainerRef: ViewContainerRef;

    beforeEach(() => {
      triggerElement = new ElementRef(document.createElement('button'));
      templateRef = { elementRef: new ElementRef(document.createElement('div')) } as TemplateRef<unknown>;
      viewContainerRef = {
        createEmbeddedView: jest.fn(),
        clear: jest.fn(),
        element: new ElementRef(document.createElement('div')),
        injector: TestBed.inject(PLATFORM_ID),
      } as unknown as ViewContainerRef;
    });

    it('opens the dropdown when closed', () => {
      service.toggle(triggerElement, templateRef, viewContainerRef);

      expect(mockOverlay.create).toHaveBeenCalled();
      expect(service.isOpen()).toBe(true);
    });

    it('closes the dropdown when open', () => {
      service.toggle(triggerElement, templateRef, viewContainerRef);
      service.toggle(triggerElement, templateRef, viewContainerRef);

      expect(mockOverlayRef.detach).toHaveBeenCalled();
      expect(service.isOpen()).toBe(false);
    });
  });

  describe('close', () => {
    let triggerElement: ElementRef;
    let templateRef: TemplateRef<unknown>;
    let viewContainerRef: ViewContainerRef;

    beforeEach(() => {
      triggerElement = new ElementRef(document.createElement('button'));
      templateRef = { elementRef: new ElementRef(document.createElement('div')) } as TemplateRef<unknown>;
      viewContainerRef = {
        createEmbeddedView: jest.fn(),
        clear: jest.fn(),
        element: new ElementRef(document.createElement('div')),
        injector: TestBed.inject(PLATFORM_ID),
      } as unknown as ViewContainerRef;

      service.toggle(triggerElement, templateRef, viewContainerRef);
    });

    it('detaches the overlay if attached', () => {
      mockOverlayRef.hasAttached.mockReturnValue(true);

      service.close();

      expect(mockOverlayRef.detach).toHaveBeenCalled();
    });

    it('does not detach the overlay if not attached', () => {
      mockOverlayRef.hasAttached.mockReturnValue(false);

      service.close();

      expect(mockOverlayRef.detach).not.toHaveBeenCalled();
    });

    it('sets isOpen signal to false', () => {
      service.close();

      expect(service.isOpen()).toBe(false);
    });

    it('disposes of the overlay', () => {
      service.close();

      expect(mockOverlayRef.dispose).toHaveBeenCalled();
    });

    it('calls unlisten after keyboard navigation is set up', async () => {
      const menuElement = document.createElement('div');
      menuElement.setAttribute('role', 'menu');
      mockOverlayRef.overlayElement.appendChild(menuElement);

      await new Promise(resolve => setTimeout(resolve, 100));

      service.close();

      expect(mockUnlistenFn).toHaveBeenCalled();
    });
  });

  describe('keyboard navigation', () => {
    let triggerElement: ElementRef;
    let templateRef: TemplateRef<unknown>;
    let viewContainerRef: ViewContainerRef;
    let menuElement: HTMLElement;
    let menuItems: HTMLElement[];

    beforeEach(() => {
      triggerElement = new ElementRef(document.createElement('button'));
      templateRef = { elementRef: new ElementRef(document.createElement('div')) } as TemplateRef<unknown>;
      viewContainerRef = {
        createEmbeddedView: jest.fn(),
        clear: jest.fn(),
        element: new ElementRef(document.createElement('div')),
        injector: TestBed.inject(PLATFORM_ID),
      } as unknown as ViewContainerRef;

      menuElement = document.createElement('div');
      menuElement.setAttribute('role', 'menu');

      menuItems = [document.createElement('div'), document.createElement('div'), document.createElement('div')];

      menuItems.forEach(item => {
        item.setAttribute('z-dropdown-menu-item', '');
        menuElement.appendChild(item);
      });

      mockOverlayRef.overlayElement.appendChild(menuElement);
    });

    it('sets up keyboard navigation on open', async () => {
      service.toggle(triggerElement, templateRef, viewContainerRef);

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockRenderer.listen).toHaveBeenCalled();
    });

    it('does not set up keyboard navigation when menu element is missing', () => {
      mockOverlayRef.overlayElement = document.createElement('div');

      service.toggle(triggerElement, templateRef, viewContainerRef);

      expect(mockRenderer.listen).not.toHaveBeenCalled();
    });
  });

  describe('focused item management', () => {
    let triggerElement: ElementRef;
    let templateRef: TemplateRef<unknown>;
    let viewContainerRef: ViewContainerRef;

    beforeEach(() => {
      triggerElement = new ElementRef(document.createElement('button'));
      templateRef = { elementRef: new ElementRef(document.createElement('div')) } as TemplateRef<unknown>;
      viewContainerRef = {
        createEmbeddedView: jest.fn(),
        clear: jest.fn(),
        element: new ElementRef(document.createElement('div')),
        injector: TestBed.inject(PLATFORM_ID),
      } as unknown as ViewContainerRef;
    });

    it('focuses first item on open', async () => {
      const menuElement = document.createElement('div');
      menuElement.setAttribute('role', 'menu');

      const firstItem = document.createElement('div');
      firstItem.setAttribute('z-dropdown-menu-item', '');
      menuElement.appendChild(firstItem);

      mockOverlayRef.overlayElement.appendChild(menuElement);

      service.toggle(triggerElement, templateRef, viewContainerRef);

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(firstItem.dataset['highlighted']).toBe('');
    });
  });
});

describe('ZardDropdownService - server platform behavior', () => {
  let service: ZardDropdownService;
  let triggerElement: ElementRef;
  let templateRef: TemplateRef<unknown>;
  let viewContainerRef: ViewContainerRef;
  let mockOverlay: jest.Mocked<Overlay>;
  let mockOverlayRef: jest.Mocked<OverlayRef & { overlayElement: HTMLElement }>;
  let mockOverlayPositionBuilder: jest.Mocked<OverlayPositionBuilder>;
  let mockRenderer: jest.Mocked<Renderer2>;

  beforeEach(() => {
    mockOverlayRef = {
      attach: jest.fn(),
      detach: jest.fn(),
      dispose: jest.fn(),
      hasAttached: jest.fn().mockReturnValue(true),
      outsidePointerEvents: jest.fn().mockReturnValue({
        pipe: jest.fn().mockReturnValue({
          subscribe: jest.fn().mockReturnValue({
            unsubscribe: jest.fn(),
          }),
        }),
      }),
      overlayElement: document.createElement('div'),
    } as unknown as jest.Mocked<OverlayRef & { overlayElement: HTMLElement }>;

    mockOverlayPositionBuilder = {
      flexibleConnectedTo: jest.fn().mockReturnValue({
        withPositions: jest.fn().mockReturnValue({
          withPush: jest.fn().mockReturnValue({}),
        }),
      }),
    } as unknown as jest.Mocked<OverlayPositionBuilder>;

    mockOverlay = {
      create: jest.fn().mockReturnValue(mockOverlayRef),
      scrollStrategies: {
        reposition: jest.fn().mockReturnValue({}),
      },
    } as unknown as jest.Mocked<Overlay>;

    mockRenderer = {
      listen: jest.fn(),
      destroy: jest.fn(),
    } as unknown as jest.Mocked<Renderer2>;

    const mockRendererFactory = {
      createRenderer: jest.fn().mockReturnValue(mockRenderer),
    } as unknown as jest.Mocked<RendererFactory2>;

    TestBed.configureTestingModule({
      providers: [
        ZardDropdownService,
        { provide: Overlay, useValue: mockOverlay },
        { provide: OverlayPositionBuilder, useValue: mockOverlayPositionBuilder },
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: RendererFactory2, useValue: mockRendererFactory },
      ],
    });

    service = TestBed.inject(ZardDropdownService);

    triggerElement = new ElementRef(document.createElement('button'));
    templateRef = { elementRef: new ElementRef(document.createElement('div')) } as TemplateRef<unknown>;
    viewContainerRef = {
      createEmbeddedView: jest.fn(),
      clear: jest.fn(),
      element: new ElementRef(document.createElement('div')),
      injector: TestBed.inject(PLATFORM_ID),
    } as unknown as ViewContainerRef;
  });

  it('does not set up keyboard navigation on server platform', () => {
    service.toggle(triggerElement, templateRef, viewContainerRef);

    expect(mockRenderer.listen).not.toHaveBeenCalled();
  });
});
```

## dropdown.service.ts
```typescript
import { Overlay, OverlayPositionBuilder, type OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  type ElementRef,
  inject,
  Injectable,
  PLATFORM_ID,
  Renderer2,
  RendererFactory2,
  signal,
  type TemplateRef,
  type ViewContainerRef,
} from '@angular/core';

import { filter, type Subscription } from 'rxjs';

import { noopFn } from '@/shared/utils/merge-classes';

@Injectable({
  providedIn: 'root',
})
export class ZardDropdownService {
  private readonly overlay = inject(Overlay);
  private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly rendererFactory = inject(RendererFactory2);

  private overlayRef?: OverlayRef;
  private portal?: TemplatePortal;
  private triggerElement?: ElementRef;
  private renderer!: Renderer2;
  private readonly focusedIndex = signal<number>(-1);
  private outsideClickSubscription!: Subscription;
  private unlisten: () => void = noopFn;

  readonly isOpen = signal(false);

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  toggle(triggerElement: ElementRef, template: TemplateRef<unknown>, viewContainerRef: ViewContainerRef) {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open(triggerElement, template, viewContainerRef);
    }
  }

  private open(triggerElement: ElementRef, template: TemplateRef<unknown>, viewContainerRef: ViewContainerRef) {
    if (this.isOpen()) {
      this.close();
    }

    this.triggerElement = triggerElement;
    this.createOverlay(triggerElement);

    if (!this.overlayRef) {
      return;
    }

    this.portal = new TemplatePortal(template, viewContainerRef);
    this.overlayRef.attach(this.portal);

    // Setup keyboard navigation
    setTimeout(() => {
      this.setupKeyboardNavigation();
      this.focusFirstItem();
    }, 0);

    // Close on outside click
    this.outsideClickSubscription = this.overlayRef
      .outsidePointerEvents()
      .pipe(filter(event => !triggerElement.nativeElement.contains(event.target)))
      .subscribe(() => {
        this.close();
      });
    this.isOpen.set(true);
  }

  close() {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
    this.focusedIndex.set(-1);
    this.unlisten();
    this.destroyOverlay();
    this.isOpen.set(false);
  }

  private createOverlay(triggerElement: ElementRef) {
    if (this.overlayRef) {
      this.destroyOverlay();
    }

    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(triggerElement)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 4,
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetY: -4,
        },
      ])
      .withPush(false);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      minWidth: 200,
      maxHeight: 400,
    });
  }

  private destroyOverlay() {
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
    this.outsideClickSubscription?.unsubscribe();
  }

  private setupKeyboardNavigation() {
    if (!this.overlayRef?.hasAttached() || !isPlatformBrowser(this.platformId)) {
      return;
    }

    const dropdownElement = this.overlayRef.overlayElement.querySelector('[role="menu"]') as HTMLElement;
    if (!dropdownElement) {
      return;
    }

    this.unlisten = this.renderer.listen(
      dropdownElement,
      'keydown.{arrowdown,arrowup,enter,space,escape,home,end}.prevent',
      (event: KeyboardEvent) => {
        const items = this.getDropdownItems();

        switch (event.key) {
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
            this.triggerElement?.nativeElement.focus();
            break;
          case 'Home':
            this.focusItemAtIndex(items, 0);
            break;
          case 'End':
            this.focusItemAtIndex(items, items.length - 1);
            break;
        }
      },
    );

    // Focus dropdown container
    dropdownElement.focus();
  }

  private getDropdownItems(): HTMLElement[] {
    if (!this.overlayRef?.hasAttached()) {
      return [];
    }
    const dropdownElement = this.overlayRef.overlayElement;
    return Array.from(
      dropdownElement.querySelectorAll<HTMLElement>('z-dropdown-menu-item, [z-dropdown-menu-item]'),
    ).filter(item => item.dataset['disabled'] === undefined);
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

    this.focusItemAtIndex(items, nextIndex);
  }

  private focusItemAtIndex(items: HTMLElement[], index: number) {
    if (index >= 0 && index < items.length) {
      this.focusedIndex.set(index);
      this.updateItemFocus(items, index);
    }
  }

  private focusFirstItem() {
    const items = this.getDropdownItems();
    if (items.length > 0) {
      this.focusItemAtIndex(items, 0);
    }
  }

  private selectFocusedItem(items: HTMLElement[]) {
    const currentIndex = this.focusedIndex();
    if (currentIndex >= 0 && currentIndex < items.length) {
      const item = items[currentIndex];
      item.click();
    }
  }

  private updateItemFocus(items: HTMLElement[], focusedIndex: number) {
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      if (index === focusedIndex) {
        item.focus();
        item.dataset['highlighted'] = '';
      } else {
        delete item.dataset['highlighted'];
      }
    }
  }
}
```

## dropdown.variants.ts
```typescript
import { cva, type VariantProps } from 'class-variance-authority';

export const dropdownContentVariants = cva(
  'bg-popover text-popover-foreground z-50 min-w-50 overflow-y-auto rounded-md border py-1 px-1 shadow-md',
);

export const dropdownItemVariants = cva(
  'relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: '',
        destructive:
          'text-destructive hover:bg-destructive/10 focus:bg-destructive/10 dark:hover:bg-destructive/20 dark:focus:bg-destructive/20 focus:text-destructive',
      },
      inset: {
        true: 'pl-8',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      inset: false,
    },
  },
);

export type ZardDropdownItemVariants = VariantProps<typeof dropdownItemVariants>;
```

## index.ts
```typescript
export * from './dropdown.component';
export * from './dropdown-item.component';
export * from './dropdown-menu-content.component';
export * from './dropdown-trigger.directive';
export * from './dropdown.service';
export * from './dropdown.imports';
export * from './dropdown.variants';
```

