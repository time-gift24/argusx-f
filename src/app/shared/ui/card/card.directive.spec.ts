import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardDirective, CardHeaderDirective, CardFooterDirective } from './card.directive';

@Component({
  selector: 'test-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <div appCard>Content</div> `,
})
class TestComponent {}

describe('CardDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
  });

  it('should create component', () => {
    fixture.detectChanges();
    expect(fixture).toBeTruthy();
  });

  it('should apply card directive to element', () => {
    fixture.detectChanges();
    const card = fixture.nativeElement.querySelector('[appCard]');
    expect(card).toBeTruthy();
  });
});
