import { Component, input, ViewChildren, QueryList, NO_ERRORS_SCHEMA, importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonDirective, buttonVariants } from './button.directive';

describe('ButtonDirective', () => {
  let fixture: ComponentFixture<TestButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonDirective],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TestButtonComponent);
    fixture.detectChanges();
  });

  it('should create component with button directive', () => {
    expect(fixture).toBeTruthy();
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(1);
  });
});

describe('buttonVariants', () => {
  it('should return string for all variants', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;

    for (const variant of variants) {
      const classes = buttonVariants({ variant });
      expect(typeof classes).toBe('string');
      expect(classes.length).toBeGreaterThan(0);
    }
  });

  it('should return string for all sizes', () => {
    const sizes = ['default', 'sm', 'lg', 'icon'] as const;

    for (const size of sizes) {
      const classes = buttonVariants({ size });
      expect(typeof classes).toBe('string');
      expect(classes.length).toBeGreaterThan(0);
    }
  });

  it('should return string for variant and size combinations', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;
    const sizes = ['default', 'sm', 'lg', 'icon'] as const;

    for (const v of variants) {
      for (const s of sizes) {
        const classes = buttonVariants({ variant: v, size: s });
        expect(typeof classes).toBe('string');
        expect(classes.length).toBeGreaterThan(0);
      }
    }
  });
});

@Component({
  standalone: true,
  imports: [ButtonDirective],
  schemas: [NO_ERRORS_SCHEMA],
  template: `<button [argusButton]="null" [variant]="variant" [size]="size" [asChild]="asChild">Test</button>`,
})
class TestButtonComponent {
  readonly variant = input<'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'>('default');
  readonly size = input<'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg'>('default');
  readonly asChild = input<boolean>(false);

  @ViewChildren(ButtonDirective) directives!: QueryList<ButtonDirective>;
}
