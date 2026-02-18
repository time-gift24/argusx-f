import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import 'zone.js';
import 'zone.js/testing';
import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi, describe, it, expect, beforeEach, spyOn } from 'vitest';
import { SwitchComponent } from './switch.component';

// Initialize Angular test environment
TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

describe('SwitchComponent', () => {
  let fixture: ComponentFixture<TestSwitchComponent>;
  let component: SwitchComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestSwitchComponent);
    fixture.detectChanges();
    component = fixture.componentInstance.switchComponent;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Basic toggle functionality', () => {
    it('should emit checkedChange event on click', () => {
      const emitSpy = spyOn(component.checkedChange, 'emit');
      component.onClick();
      expect(emitSpy).toHaveBeenCalledWith(true);
    });

    it('should toggle from true to false on click', () => {
      component.checked.set(true);
      fixture.detectChanges();
      const emitSpy = spyOn(component.checkedChange, 'emit');
      component.onClick();
      expect(emitSpy).toHaveBeenCalledWith(false);
    });

    it('should emit new value on click', () => {
      const emitSpy = spyOn(component.checkedChange, 'emit');
      component.onClick();
      expect(emitSpy).toHaveBeenCalledWith(true);
    });
  });

  describe('Disabled state blocking interactions', () => {
    it('should not emit event when disabled on click', () => {
      component.disabled.set(true);
      fixture.detectChanges();
      const emitSpy = spyOn(component.checkedChange, 'emit');
      component.onClick();
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should not emit event when disabled on keydown', () => {
      component.disabled.set(true);
      fixture.detectChanges();
      const emitSpy = spyOn(component.checkedChange, 'emit');
      const event = new KeyboardEvent('keydown', { key: ' ' });
      component.onKeydown(event);
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard accessibility', () => {
    it('should toggle on Space key', () => {
      const emitSpy = spyOn(component.checkedChange, 'emit');
      const event = new KeyboardEvent('keydown', { key: ' ' });
      component.onKeydown(event);
      expect(emitSpy).toHaveBeenCalledWith(true);
    });

    it('should toggle on Enter key', () => {
      component.checked.set(true);
      fixture.detectChanges();
      const emitSpy = spyOn(component.checkedChange, 'emit');
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component.onKeydown(event);
      expect(emitSpy).toHaveBeenCalledWith(false);
    });

    it('should prevent default on Space key', () => {
      const event = new KeyboardEvent('keydown', { key: ' ' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      component.onKeydown(event);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should prevent default on Enter key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      component.onKeydown(event);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Event emission', () => {
    it('should emit boolean value on toggle', () => {
      const emitSpy = spyOn(component.checkedChange, 'emit');
      component.onClick();
      expect(emitSpy).toHaveBeenCalledWith(expect.any(Boolean));
    });

    it('should emit true when unchecked and clicked', () => {
      const emitSpy = spyOn(component.checkedChange, 'emit');
      component.checked.set(false);
      fixture.detectChanges();
      component.onClick();
      expect(emitSpy).toHaveBeenCalledWith(true);
    });

    it('should emit false when checked and clicked', () => {
      const emitSpy = spyOn(component.checkedChange, 'emit');
      component.checked.set(true);
      fixture.detectChanges();
      component.onClick();
      expect(emitSpy).toHaveBeenCalledWith(false);
    });
  });

  describe('Class/computedClass generation', () => {
    it('should generate base switch classes', () => {
      const classes = component.computedClass();
      expect(classes).toContain('inline-flex');
      expect(classes).toContain('h-5');
      expect(classes).toContain('w-9');
      expect(classes).toContain('rounded-full');
    });

    it('should include focus-visible classes', () => {
      const classes = component.computedClass();
      expect(classes).toContain('focus-visible:outline-none');
      expect(classes).toContain('focus-visible:ring-2');
    });

    it('should include disabled classes', () => {
      const classes = component.computedClass();
      expect(classes).toContain('disabled:pointer-events-none');
      expect(classes).toContain('disabled:opacity-50');
    });

    it('should include checked state classes', () => {
      component.checked.set(true);
      fixture.detectChanges();
      const classes = component.computedClass();
      expect(classes).toContain('data-[state=checked]:bg-primary');
    });

    it('should include unchecked state classes', () => {
      const classes = component.computedClass();
      expect(classes).toContain('data-[state=unchecked]:bg-input');
    });

    it('should include custom class when provided', () => {
      component.class.set('custom-class');
      fixture.detectChanges();
      const classes = component.computedClass();
      expect(classes).toContain('custom-class');
    });
  });

  describe('Form integration attributes', () => {
    it('should support name attribute', () => {
      component.name.set('notifications');
      fixture.detectChanges();
      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement.getAttribute('name')).toBe('notifications');
    });

    it('should not render name attribute when empty', () => {
      fixture.detectChanges();
      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement.getAttribute('name')).toBeNull();
    });
  });

  describe('Accessible name support', () => {
    it('should support aria-label attribute', () => {
      component.ariaLabel.set('Enable notifications');
      fixture.detectChanges();
      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement.getAttribute('aria-label')).toBe('Enable notifications');
    });

    it('should not render aria-label when empty', () => {
      fixture.detectChanges();
      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement.getAttribute('aria-label')).toBeNull();
    });
  });

  describe('ARIA attributes', () => {
    it('should have role switch', () => {
      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement.getAttribute('role')).toBe('switch');
    });

    it('should have aria-checked reflecting checked state', () => {
      component.checked.set(true);
      fixture.detectChanges();
      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement.getAttribute('aria-checked')).toBe('true');
    });

    it('should have aria-disabled when disabled', () => {
      component.disabled.set(true);
      fixture.detectChanges();
      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement.getAttribute('aria-disabled')).toBe('true');
    });

    it('should have aria-required when required', () => {
      component.required.set(true);
      fixture.detectChanges();
      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement.getAttribute('aria-required')).toBe('true');
    });

    it('should have tabindex 0 when enabled', () => {
      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement.getAttribute('tabindex')).toBe('0');
    });

    it('should have tabindex -1 when disabled', () => {
      component.disabled.set(true);
      fixture.detectChanges();
      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement.getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('Data attributes', () => {
    it('should have data-state checked when checked', () => {
      component.checked.set(true);
      fixture.detectChanges();
      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement.getAttribute('data-state')).toBe('checked');
    });

    it('should have data-state unchecked when not checked', () => {
      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement.getAttribute('data-state')).toBe('unchecked');
    });

    it('should have data-disabled when disabled', () => {
      component.disabled.set(true);
      fixture.detectChanges();
      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement.getAttribute('data-disabled')).toBe('');
    });
  });

  describe('id attribute', () => {
    it('should support id attribute', () => {
      component.id.set('my-switch');
      fixture.detectChanges();
      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement.getAttribute('id')).toBe('my-switch');
    });

    it('should not render id when empty', () => {
      fixture.detectChanges();
      const hostElement = fixture.nativeElement as HTMLElement;
      expect(hostElement.getAttribute('id')).toBeNull();
    });
  });
});

@Component({
  standalone: true,
  imports: [SwitchComponent],
  template: `<app-switch
    [id]="id"
    [name]="name"
    [checked]="checked"
    [disabled]="disabled"
    [required]="required"
    [ariaLabel]="ariaLabel"
    [class]="class"
    (checkedChange)="onCheckedChange($event)"
  />`,
})
class TestSwitchComponent {
  readonly id = input<string>('');
  readonly name = input<string>('');
  readonly checked = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly ariaLabel = input<string>('');
  readonly class = input<string>('');

  readonly switchComponent = SwitchComponent;

  onCheckedChange(_value: boolean): void {
    // Event handler
  }
}
