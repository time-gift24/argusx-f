import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CardDirective } from './card.directive';

@Component({
  selector: 'test-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <div appCard>Content</div> `,
})
class TestComponent {}

describe('CardDirective', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [CardDirective],
    })
  );

  it('should create an instance', () => {
    const directive = TestBed.createComponent(TestComponent);
    expect(directive).toBeTruthy();
  });

  it('should apply default size class', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CardDirective],
      template: `<div appCard>Content</div>`,
    }).createComponent(TestComponent);

    fixture.detectChanges();
    const card = fixture.nativeElement.querySelector('[appCard]');
    expect(card).toBeTruthy();
    expect(card.classList.contains('rounded-lg')).toBe(true);
  });

  it('should support aria-labelledby and aria-describedby', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CardDirective],
      template: `
        <div appCard [ariaLabelledBy]="'title-id'" [ariaDescribedBy]="'desc-id'">
          <div appCardHeader>
            <div appCardTitle>Title</div>
            <div appCardDescription>Description</div>
          </div>
        </div>
      `,
    }).createComponent(TestComponent);

    fixture.detectChanges();
    const card = fixture.nativeElement.querySelector('[appCard]');
    expect(card.getAttribute('aria-labelledby')).toBe('title-id');
    expect(card.getAttribute('aria-describedby')).toBe('desc-id');
  });
});
