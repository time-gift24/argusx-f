import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ArgusxTextareaDirective } from './textarea.directive';

describe('ArgusxTextareaDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('applies to textarea[argusxTextarea] and emits shadcn data-slot', () => {
    const nodes = fixture.debugElement.queryAll(By.directive(ArgusxTextareaDirective));
    expect(nodes.length).toBe(3);

    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('[data-testid="basic"]');
    expect(textarea.getAttribute('data-slot')).toBe('textarea');
    expect(textarea.className).toContain('border-input');
    expect(textarea.className).toContain('focus-visible:ring-[3px]');
  });

  it('keeps aria-invalid visual contract via class list', () => {
    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector(
      '[data-testid="invalid"]'
    );
    expect(textarea.className).toContain('aria-invalid:border-destructive');
    expect(textarea.className).toContain('aria-invalid:ring-destructive/20');
  });

  it('supports ArgusX plain extension API with variant/size/status', () => {
    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector(
      '[data-testid="extension"]'
    );

    expect(textarea.getAttribute('data-variant')).toBe('borderless');
    expect(textarea.getAttribute('data-size')).toBe('sm');
    expect(textarea.getAttribute('data-status')).toBe('warning');
    expect(textarea.className).toContain('border-0');
    expect(textarea.className).toContain('min-h-14');
    expect(textarea.className).toContain('border-yellow-500');
  });
});

describe('ArgusxTextareaDirective with ReactiveForms', () => {
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

  it('syncs control value to native textarea and native textarea back to control', () => {
    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector(
      '[data-testid="form-textarea"]'
    );

    control.setValue('first line');
    fixture.detectChanges();
    expect(textarea.value).toBe('first line');

    textarea.value = 'updated from textarea';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(control.value).toBe('updated from textarea');
  });

  it('syncs disabled state from FormControl', () => {
    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector(
      '[data-testid="form-textarea"]'
    );

    control.disable();
    fixture.detectChanges();
    expect(textarea.disabled).toBe(true);

    control.enable();
    fixture.detectChanges();
    expect(textarea.disabled).toBe(false);
  });
});

@Component({
  standalone: true,
  imports: [ArgusxTextareaDirective],
  template: `
    <textarea argusxTextarea data-testid="basic"></textarea>
    <textarea argusxTextarea data-testid="invalid" aria-invalid="true"></textarea>
    <textarea
      argusxTextarea
      data-testid="extension"
      [argusxVariant]="'borderless'"
      [argusxSize]="'sm'"
      [argusxStatus]="'warning'"
    ></textarea>
  `,
})
class TestHostComponent {}

@Component({
  standalone: true,
  imports: [ArgusxTextareaDirective, ReactiveFormsModule],
  template: `
    <textarea argusxTextarea [formControl]="control" data-testid="form-textarea"></textarea>
  `,
})
class TestFormHostComponent {
  readonly control = new FormControl<string | null>('');
}
