import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  CarouselComponent,
  CarouselContentComponent,
  CarouselItemComponent,
  CarouselPreviousComponent,
  CarouselNextComponent,
  CarouselDotsComponent,
} from './carousel.component';
import { Component } from '@angular/core';

describe('CarouselComponent', () => {
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
  });

  it('should create component', () => {
    fixture.detectChanges();
    expect(fixture).toBeTruthy();
  });

  it('should render carousel with role region', () => {
    fixture.detectChanges();
    const carouselElement = fixture.nativeElement.querySelector('[role="region"]');
    expect(carouselElement).toBeTruthy();
  });

  it('should have aria-roledescription carousel', () => {
    fixture.detectChanges();
    const carouselElement = fixture.nativeElement.querySelector('[role="region"]');
    expect(carouselElement?.getAttribute('aria-roledescription')).toBe('carousel');
  });

  it('should render carousel items', () => {
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('[role="group"]');
    expect(items.length).toBeGreaterThan(0);
  });
});

@Component({
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
    <app-carousel>
      <app-carousel-content>
        <app-carousel-item>Slide 1</app-carousel-item>
        <app-carousel-item>Slide 2</app-carousel-item>
        <app-carousel-item>Slide 3</app-carousel-item>
      </app-carousel-content>
    </app-carousel>
  `,
})
class TestCarouselComponent {}
