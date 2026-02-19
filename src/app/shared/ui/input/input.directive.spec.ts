import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ArgusxInputDirective } from './input.directive';

describe('ArgusxInputDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('applies to input[argusxInput] and emits shadcn data-slot', () => {
    const nodes = fixture.debugElement.queryAll(By.directive(ArgusxInputDirective));
    expect(nodes.length).toBe(2);

    const input: HTMLInputElement = fixture.nativeElement.querySelector('[data-testid="basic"]');
    expect(input.getAttribute('data-slot')).toBe('input');
    expect(input.getAttribute('data-status')).toBeNull();
    expect(input.getAttribute('data-size')).toBeNull();
    expect(input.className).toContain('border-input');
  });

  it('keeps aria-invalid visual contract via class list', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('[data-testid="invalid"]');
    expect(input.className).toContain('aria-invalid:border-destructive');
    expect(input.className).toContain('aria-invalid:ring-destructive/20');
  });
});

describe('ArgusxInputDirective with ReactiveForms', () => {
  let fixture: ComponentFixture<TestFormHostComponent>;
  let control: FormControl<string | null>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestFormHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestFormHostComponent);
    ({ control } = fixture.componentInstance);
    fixture.detectChanges();
  });

  it('syncs control value to native input and native input back to control', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('[data-testid="form-input"]');

    control.setValue('pedro');
    fixture.detectChanges();
    expect(input.value).toBe('pedro');

    input.value = 'duarte';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(control.value).toBe('duarte');
  });

  it('syncs disabled state from FormControl', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('[data-testid="form-input"]');

    control.disable();
    fixture.detectChanges();
    expect(input.disabled).toBe(true);

    control.enable();
    fixture.detectChanges();
    expect(input.disabled).toBe(false);
  });
});

@Component({
  standalone: true,
  imports: [ArgusxInputDirective],
  template: `
    <input argusxInput data-testid="basic" />
    <input argusxInput data-testid="invalid" aria-invalid="true" />
  `,
})
class TestHostComponent {}

@Component({
  standalone: true,
  imports: [ArgusxInputDirective, ReactiveFormsModule],
  template: `
    <input argusxInput [formControl]="control" data-testid="form-input" />
  `,
})
class TestFormHostComponent {
  readonly control = new FormControl<string | null>('');
}
