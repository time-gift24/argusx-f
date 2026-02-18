import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {
  CarouselComponent,
  CarouselContentComponent,
  CarouselItemComponent,
  CarouselPreviousComponent,
  CarouselNextComponent,
  CarouselDotsComponent,
  CarouselVariant,
  CarouselSize,
} from './carousel.component';
import { Component, signal } from '@angular/core';

describe('CarouselComponent', () => {
  let component: TestCarouselComponent;
  let fixture: ComponentFixture<TestCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CarouselComponent,
        CarouselContentComponent,
        CarouselItemComponent,
        CarouselPreviousComponent,
        CarouselNextComponent,
        CarouselDotsComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick(100); // Allow effect to initialize slides
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render carousel with correct role and aria attributes', () => {
    const carouselElement = fixture.nativeElement.querySelector('[role="region"]');
    expect(carouselElement).toBeTruthy();
    expect(carouselElement.getAttribute('aria-roledescription')).toBe('carousel');
    expect(carouselElement.getAttribute('data-slot')).toBe('carousel');
  });

  it('should render carousel items', () => {
    const items = fixture.nativeElement.querySelectorAll('[role="group"]');
    expect(items.length).toBe(3);
  });

  it('should have correct aria attributes on items', () => {
    const items = fixture.nativeElement.querySelectorAll('[role="group"]');
    items.forEach((item: Element) => {
      expect(item.getAttribute('aria-roledescription')).toBe('slide');
      expect(item.getAttribute('data-slot')).toBe('carousel-item');
    });
  });

  describe('Navigation', () => {
    it('should initialize with first slide active', () => {
      const content = fixture.nativeElement.querySelector('[data-slot="carousel-content"]');
      expect(content.style.transform).toContain('translateX(-0%)');
    });

    it('should scroll to next slide', fakeAsync(() => {
      const nextButton = fixture.nativeElement.querySelector('[aria-label="Next slide"]');
      nextButton.click();
      tick(350); // Allow transition + effect

      const content = fixture.nativeElement.querySelector('[data-slot="carousel-content"]');
      expect(content.style.transform).toContain('translateX(-100%)');
    }));

    it('should scroll to previous slide', fakeAsync(() => {
      // First go to next
      const nextButton = fixture.nativeElement.querySelector('[aria-label="Next slide"]');
      nextButton.click();
      tick(350);

      // Then go back
      const prevButton = fixture.nativeElement.querySelector('[aria-label="Previous slide"]');
      prevButton.click();
      tick(350);

      const content = fixture.nativeElement.querySelector('[data-slot="carousel-content"]');
      expect(content.style.transform).toContain('translateX(-0%)');
    }));

    it('should scroll to specific index via dots', fakeAsync(() => {
      const dots = fixture.nativeElement.querySelectorAll('[aria-label^="Go to slide"]');
      (dots[2] as HTMLButtonElement).click();
      tick(350);

      const content = fixture.nativeElement.querySelector('[data-slot="carousel-content"]');
      expect(content.style.transform).toContain('translateX(-200%)');
    }));
  });

  describe('Loop mode', () => {
    it('should loop from last to first slide when loop is enabled', fakeAsync(() => {
      component.loopMode = true;
      fixture.detectChanges();

      // Go to last slide
      let nextButton = fixture.nativeElement.querySelector('[aria-label="Next slide"]');
      nextButton.click();
      tick(350);
      nextButton.click();
      tick(350);

      // Should loop back to first
      const content = fixture.nativeElement.querySelector('[data-slot="carousel-content"]');
      expect(content.style.transform).toContain('translateX(-0%)');
    }));

    it('should disable prev button at first slide when loop is disabled', fakeAsync(() => {
      component.loopMode = false;
      fixture.detectChanges();

      const prevButton = fixture.nativeElement.querySelector('[aria-label="Previous slide"]');
      expect(prevButton.hasAttribute('disabled')).toBeTrue();
    }));
  });

  describe('Keyboard navigation', () => {
    it('should respond to ArrowRight key', fakeAsync(() => {
      const carousel = fixture.nativeElement.querySelector('[role="region"]');
      carousel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      tick(50);

      const content = fixture.nativeElement.querySelector('[data-slot="carousel-content"]');
      expect(content.style.transform).toContain('translateX(-100%)');
    }));

    it('should respond to ArrowLeft key after scrolling right', fakeAsync(() => {
      // First scroll right
      const carousel = fixture.nativeElement.querySelector('[role="region"]');
      carousel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      tick(50);

      // Then scroll left
      carousel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      tick(50);

      const content = fixture.nativeElement.querySelector('[data-slot="carousel-content"]');
      expect(content.style.transform).toContain('translateX(-0%)');
    }));

    it('should prevent default on arrow keys', () => {
      const carousel = fixture.nativeElement.querySelector('[role="region"]');
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
      const preventDefaultSpy = spyOn(event, 'preventDefault');

      carousel.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('API output', () => {
    it('should emit carousel API', fakeAsync(() => {
      expect(component.carouselApi).toBeTruthy();
    }));
  });

  describe('A11y', () => {
    it('should have proper tabindex on carousel', () => {
      const carousel = fixture.nativeElement.querySelector('[role="region"]');
      expect(carousel.getAttribute('tabindex')).toBeFalsy(); // Default behavior
    });

    it('should have accessible labels on navigation buttons', () => {
      const nextButton = fixture.nativeElement.querySelector('[aria-label="Next slide"]');
      const prevButton = fixture.nativeElement.querySelector('[aria-label="Previous slide"]');

      expect(nextButton).toBeTruthy();
      expect(prevButton).toBeTruthy();

      // Check for sr-only text
      const srNext = nextButton.querySelector('.sr-only');
      const srPrev = prevButton.querySelector('.sr-only');
      expect(srNext).toBeTruthy();
      expect(srPrev).toBeTruthy();
    });

    it('should have accessible dot indicators', () => {
      const dots = fixture.nativeElement.querySelectorAll('[aria-label^="Go to slide"]');
      expect(dots.length).toBe(3);

      // First dot should be current
      const firstDot = dots[0];
      expect(firstDot.getAttribute('aria-current')).toBe('true');
    });
  });

  describe('Vertical orientation', () => {
    it('should support vertical orientation', fakeAsync(() => {
      component.orientation = 'vertical';
      fixture.detectChanges();
      tick(100);

      const carousel = fixture.nativeElement.querySelector('[role="region"]');
      carousel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      tick(50);

      const content = fixture.nativeElement.querySelector('[data-slot="carousel-content"]');
      expect(content.style.transform).toContain('translateY(-100%)');
    }));
  });

  describe('Variants and sizes', () => {
    it('should accept variant input', () => {
      component.variant = 'overflow';
      fixture.detectChanges();

      const carousel = fixture.nativeElement.querySelector('[role="region"]');
      expect(carousel).toBeTruthy();
      expect(carousel.classList).toContain('overflow-visible');
    });

    it('should accept size input', () => {
      component.size = 'lg';
      fixture.detectChanges();

      const carousel = fixture.nativeElement.querySelector('[role="region"]');
      expect(carousel).toBeTruthy();
      expect(carousel.classList).toContain('py-6');
    });
  });
});

@Component({
  selector: 'app-test-carousel',
  standalone: true,
  imports: [
    CarouselComponent,
    CarouselContentComponent,
    CarouselItemComponent,
    CarouselPreviousComponent,
    CarouselNextComponent,
    CarouselDotsComponent,
  ],
  template: `
    <app-carousel
      [opts]="{ loop: loopMode }"
      [orientation]="orientation"
      [variant]="variant"
      [size]="size"
      (api)="carouselApi = $event"
    >
      <app-carousel-content>
        <app-carousel-item>
          <div class="aspect-square rounded-md bg-muted p-6 flex items-center justify-center">
            <span class="text-2xl font-semibold">1</span>
          </div>
        </app-carousel-item>
        <app-carousel-item>
          <div class="aspect-square rounded-md bg-muted p-6 flex items-center justify-center">
            <span class="text-2xl font-semibold">2</span>
          </div>
        </app-carousel-item>
        <app-carousel-item>
          <div class="aspect-square rounded-md bg-muted p-6 flex items-center justify-center">
            <span class="text-2xl font-semibold">3</span>
          </div>
        </app-carousel-item>
      </app-carousel-content>
      <app-carousel-previous />
      <app-carousel-next />
      <app-carousel-dots />
    </app-carousel>
  `,
})
class TestCarouselComponent {
  loopMode = false;
  orientation: 'horizontal' | 'vertical' = 'horizontal';
  variant: CarouselVariant = 'default';
  size: CarouselSize = 'default';
  carouselApi: unknown;
}
