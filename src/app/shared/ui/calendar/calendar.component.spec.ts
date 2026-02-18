import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarComponent } from './calendar.component';

describe('CalendarComponent', () => {
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
  });

  it('should create component', () => {
    fixture.detectChanges();
    expect(fixture).toBeTruthy();
  });

  it('should render calendar element', () => {
    fixture.detectChanges();
    // Calendar renders a grid element
    const grid = fixture.nativeElement.querySelector('[role="grid"]');
    expect(grid).toBeTruthy();
  });
});
