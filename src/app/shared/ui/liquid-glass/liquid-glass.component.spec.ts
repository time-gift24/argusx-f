import { describe, it, expect } from 'vitest';
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
    expect(component.filterId()).toBe('liquid-filter-standard');
  });

  it('should compute backdrop filter correctly', () => {
    const filter = component.backdropFilter();
    expect(filter).toContain('blur');
    expect(filter).toContain('saturate');
  });
});
