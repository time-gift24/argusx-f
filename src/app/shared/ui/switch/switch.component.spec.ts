import { Component, input, ViewChild, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { SwitchComponent } from './switch.component';

describe('SwitchComponent', () => {
  let fixture: ComponentFixture<TestSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TestSwitchComponent);
  });

  it('should create component', () => {
    fixture.detectChanges();
    const switchEl = fixture.nativeElement.querySelector('[role="switch"]');
    expect(switchEl).toBeTruthy();
  });

  it('should have role switch', () => {
    fixture.detectChanges();
    const switchEl = fixture.nativeElement.querySelector('[role="switch"]');
    expect(switchEl?.getAttribute('role')).toBe('switch');
  });

  it('should have tabindex 0 by default', () => {
    fixture.detectChanges();
    const switchEl = fixture.nativeElement.querySelector('[role="switch"]');
    expect(switchEl?.getAttribute('tabindex')).toBe('0');
  });
});

@Component({
  standalone: true,
  imports: [SwitchComponent],
  schemas: [NO_ERRORS_SCHEMA],
  template: `<app-switch #switchRef [checked]="checked" [disabled]="disabled" (checkedChange)="onChange($event)" />`,
})
class TestSwitchComponent {
  readonly checked = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  @ViewChild('switchRef') switchComponent!: SwitchComponent;

  onChange(_value: boolean): void {
    // noop
  }
}
