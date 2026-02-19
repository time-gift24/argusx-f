import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  ArgusxButtonDirective,
  argusxButtonVariants,
  type ArgusxButtonShape,
  type ArgusxButtonSize,
  type ArgusxButtonVariant,
} from './button.directive';

describe('ArgusxButtonDirective', () => {
  let fixture: ComponentFixture<TestButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestButtonComponent);
    fixture.detectChanges();
  });

  it('applies to button and anchor with argusx-button selector', () => {
    const nodes = fixture.debugElement.queryAll(By.directive(ArgusxButtonDirective));
    expect(nodes.length).toBe(4);
  });

  it('emits host data attributes for variant and size', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('[data-testid="btn"]');
    expect(button.getAttribute('data-slot')).toBe('button');
    expect(button.getAttribute('data-variant')).toBe('default');
    expect(button.getAttribute('data-size')).toBe('default');
    expect(button.getAttribute('data-shape')).toBe('default');
  });

  it('returns computed classes through getClasses()', () => {
    const instance = fixture.debugElement.query(By.directive(ArgusxButtonDirective))
      .injector.get(ArgusxButtonDirective);
    expect(instance.getClasses().length).toBeGreaterThan(0);
  });

  it('applies class styles on host by default', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('[data-testid="btn"]');
    expect(button.getAttribute('class')).toBeTruthy();
  });
});

describe('argusxButtonVariants', () => {
  it('returns a class string for all variants', () => {
    const variants: readonly ArgusxButtonVariant[] = [
      'default',
      'destructive',
      'outline',
      'secondary',
      'ghost',
      'link',
    ];

    for (const variant of variants) {
      const classes = argusxButtonVariants({ variant });
      expect(typeof classes).toBe('string');
      expect(classes.length).toBeGreaterThan(0);
    }
  });

  it('returns a class string for all sizes', () => {
    const sizes: readonly ArgusxButtonSize[] = [
      'default',
      'xs',
      'sm',
      'lg',
      'icon',
      'icon-xs',
      'icon-sm',
      'icon-lg',
    ];

    for (const size of sizes) {
      const classes = argusxButtonVariants({ size });
      expect(typeof classes).toBe('string');
      expect(classes.length).toBeGreaterThan(0);
    }
  });

  it('supports shape/full/loading combinations', () => {
    const shapes: readonly ArgusxButtonShape[] = ['default', 'circle', 'square'];
    for (const shape of shapes) {
      const classes = argusxButtonVariants({ shape, full: true, loading: true });
      expect(typeof classes).toBe('string');
      expect(classes).toContain('pointer-events-none');
    }
  });
});

@Component({
  standalone: true,
  imports: [ArgusxButtonDirective],
  template: `
    <button argusx-button data-testid="btn" variant="default" size="default" shape="default">
      Test
    </button>

    <button argusx-button data-testid="loading-btn" loading>Loading</button>

    <button argusx-button data-testid="as-child" asChild>As Child</button>

    <a argusx-button data-testid="link" loading>Link</a>
  `,
})
class TestButtonComponent {}
