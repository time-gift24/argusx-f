import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiquidGlassComponent } from './liquid-glass.component';
import { DEFAULT_LIQUID_CONFIG } from './liquid-glass.config';

describe('LiquidGlassComponent', () => {
  let component: LiquidGlassComponent;
  let fixture: ComponentFixture<LiquidGlassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiquidGlassComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiquidGlassComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply default config', () => {
    expect(component.config()).toEqual(DEFAULT_LIQUID_CONFIG);
  });

  it('should generate correct filter id', () => {
    expect(component.filterId()).toMatch(/^liquid-filter-\d+-standard$/);
  });

  it('should compute backdrop filter correctly', () => {
    const filter = component.backdropFilter();
    expect(filter).toContain('blur');
    expect(filter).toContain('saturate');
  });

  it('should not render solid border by default', () => {
    fixture.detectChanges();
    const container: HTMLDivElement = fixture.nativeElement.querySelector(
      '.liquid-glass-container'
    );
    const solidBorderLayer: HTMLSpanElement | null =
      fixture.nativeElement.querySelector('.liquid-solid-border');

    expect(container.style.borderWidth).toBe('1px');
    expect(container.style.borderColor).toContain('0.2');
    expect(container.style.boxShadow).toBe('none');
    expect(solidBorderLayer).toBeNull();
  });

  it('should render solid border when enabled', () => {
    fixture.componentRef.setInput('solidBorder', true);
    fixture.componentRef.setInput('solidBorderWidth', 3);
    fixture.componentRef.setInput('solidBorderColor', 'rgba(255, 255, 255, 0.9)');
    fixture.detectChanges();

    const container: HTMLDivElement = fixture.nativeElement.querySelector(
      '.liquid-glass-container'
    );
    const solidBorderLayer: HTMLSpanElement = fixture.nativeElement.querySelector(
      '.liquid-solid-border'
    );

    expect(container.style.borderWidth).toBe('0px');
    expect(solidBorderLayer).toBeTruthy();
    expect(solidBorderLayer.style.filter).toBe('');
    expect(solidBorderLayer.style.borderWidth).toBe('3px');
    expect(solidBorderLayer.style.borderColor).toContain('0.9');
  });

  it('should highlight solid border on hover', () => {
    fixture.componentRef.setInput('solidBorder', true);
    fixture.componentRef.setInput('solidBorderHighlightColor', 'rgba(255, 255, 255, 1)');
    fixture.componentRef.setInput('solidBorderGlowColor', 'rgba(255, 255, 255, 0.45)');
    fixture.detectChanges();

    component.onMouseEnter();
    fixture.detectChanges();

    const solidBorderLayer: HTMLSpanElement = fixture.nativeElement.querySelector(
      '.liquid-solid-border'
    );

    expect(solidBorderLayer.style.borderColor).toContain('1)');
    expect(solidBorderLayer.style.boxShadow).toContain('16px');
  });
});
