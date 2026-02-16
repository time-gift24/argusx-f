import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonDirective, buttonVariants } from './button.directive';

describe('ButtonDirective', () => {
  let fixture: ComponentFixture<TestButtonComponent>;
  let directive: ButtonDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestButtonComponent);
    fixture.detectChanges();
    directive = fixture.componentInstance.buttonDirective;
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
  });

  it('should have default variant', () => {
    expect(directive.variant()).toBe('default');
  });

  it('should have default size', () => {
    expect(directive.size()).toBe('default');
  });

  it('should have default asChild', () => {
    expect(directive.asChild()).toBe(false);
  });

  it('should support asChild input', () => {
    directive.asChild.set(true);
    expect(directive.asChild()).toBe(true);
  });

  it('should compute classes correctly', () => {
    const classes = directive.getClasses();
    expect(classes).toContain('bg-primary');
  });

  it('should apply variant classes', () => {
    directive.variant.set('outline');
    fixture.detectChanges();
    const classes = directive.getClasses();
    expect(classes).toContain('border-border');
  });

  it('should apply size classes', () => {
    directive.size.set('lg');
    fixture.detectChanges();
    const classes = directive.getClasses();
    expect(classes).toContain('h-8');
  });

  it('should support all variants', () => {
    const variants: ('default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link')[] =
      ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'];

    variants.forEach((variant) => {
      directive.variant.set(variant);
      const classes = directive.getClasses();
      expect(classes).toBeTruthy();
    });
  });

  it('should support all sizes', () => {
    const sizes: ('default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg')[] =
      ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'];

    sizes.forEach((size) => {
      directive.size.set(size);
      const classes = directive.getClasses();
      expect(classes).toBeTruthy();
    });
  });
});

@Component({
  standalone: true,
  imports: [ButtonDirective],
  template: `<button argusButton [variant]="variant" [size]="size" [asChild]="asChild">Test</button>`,
})
class TestButtonComponent {
  readonly variant = input<'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'>('default');
  readonly size = input<'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg'>('default');
  readonly asChild = input<boolean>(false);
  readonly buttonDirective = ButtonDirective;
}
