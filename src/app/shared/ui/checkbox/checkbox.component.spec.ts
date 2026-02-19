import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { ArgusxCheckboxComponent } from './checkbox.component';

describe('ArgusxCheckboxComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should keep id only on inner button to avoid duplicate id targets', () => {
    const hostEl = fixture.nativeElement.querySelector('argusx-checkbox') as HTMLElement | null;
    const buttonEl = hostEl?.querySelector('button[data-slot="checkbox"]') as HTMLButtonElement | null;

    expect(hostEl).toBeTruthy();
    expect(buttonEl).toBeTruthy();
    expect(hostEl?.getAttribute('id')).toBeNull();
    expect(buttonEl?.id).toBe('terms-id');
  });

  it('should use stable host layout classes to prevent vertical shift while toggling', () => {
    const hostEl = fixture.nativeElement.querySelector('argusx-checkbox') as HTMLElement | null;

    expect(hostEl).toBeTruthy();
    expect(hostEl?.classList.contains('inline-flex')).toBe(true);
    expect(hostEl?.classList.contains('leading-none')).toBe(true);
  });

  it('should disable pointer events on indicator so checked icon click still toggles checkbox', () => {
    const indicatorEl = fixture.nativeElement.querySelector(
      'button[data-slot=\"checkbox\"] [data-slot=\"checkbox-indicator\"]'
    ) as HTMLElement | null;

    expect(indicatorEl).toBeTruthy();
    expect(indicatorEl?.classList.contains('pointer-events-none')).toBe(true);
  });
});

@Component({
  standalone: true,
  imports: [ArgusxCheckboxComponent],
  template: ` <label for="terms-id">Terms</label> <argusx-checkbox id="terms-id" /> `,
})
class TestHostComponent {}
