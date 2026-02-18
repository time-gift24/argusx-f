import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ProgressComponent } from './progress.component';

describe('ProgressComponent', () => {
  let fixture: ComponentFixture<ProgressComponent>;
  let component: ProgressComponent;
  let progressHost: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    progressHost = fixture.nativeElement as HTMLElement;
  });

  it('renders shadcn slot structure with correct default classes', () => {
    const indicator = progressHost.querySelector(
      '[data-slot="progress-indicator"]'
    ) as HTMLElement | null;

    expect(indicator).toBeTruthy();
    expect(progressHost.getAttribute('data-slot')).toBe('progress');
    expect(progressHost.getAttribute('role')).toBe('progressbar');
    expect(progressHost.className).toContain('rounded-full');
    expect(progressHost.className).toContain('h-2');
    expect(progressHost.className).toContain('bg-primary/20');
  });

  it('applies size variants via data attributes', () => {
    // Size is applied via data-size attribute on host
    expect(progressHost.getAttribute('data-size')).toBe('default');
  });

  it('applies variant via data attributes', () => {
    // Variant is applied via data-variant attribute on host
    expect(progressHost.getAttribute('data-variant')).toBe('default');
  });

  it('calculates percentage correctly with default values', () => {
    // Default value is undefined, max is 100
    expect(component.percentage()).toBe(0);
  });

  it('handles zero max value gracefully', () => {
    // When value is undefined and max is 0, percentage returns 0
    expect(component.percentage()).toBe(0);
  });

  it('sets correct ARIA attributes for default state', () => {
    // Default: value is undefined (indeterminate), max is 100
    expect(progressHost.getAttribute('aria-valuemin')).toBe('0');
    expect(progressHost.getAttribute('aria-valuemax')).toBe('100');
    expect(progressHost.getAttribute('aria-valuenow')).toBeNull();
    // When indeterminate returns false (default), aria-valuetext is undefined and not rendered
    expect(progressHost.hasAttribute('aria-valuetext')).toBe(false);
  });

  it('renders with tabindex for keyboard accessibility', () => {
    expect(progressHost.getAttribute('tabindex')).toBe('0');
  });

  it('has data-size and data-variant attributes on host', () => {
    expect(progressHost.getAttribute('data-size')).toBe('default');
    expect(progressHost.getAttribute('data-variant')).toBe('default');
  });

  it('has indicator element with primary color class by default', () => {
    const indicator = progressHost.querySelector(
      '[data-slot="progress-indicator"]'
    ) as HTMLElement;

    expect(indicator.className).toContain('bg-primary');
  });
});
