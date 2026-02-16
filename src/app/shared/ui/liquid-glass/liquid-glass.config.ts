// src/app/shared/ui/liquid-glass/liquid-glass.config.ts
import type { LiquidGlassConfig, QualityLevel } from './liquid-glass.types';

export const DEFAULT_LIQUID_CONFIG: LiquidGlassConfig = {
  displacementScale: 70,
  blurAmount: 0.0625,
  saturation: 140,
  aberrationIntensity: 2,
  elasticity: 0.15,
  cornerRadius: 999,
  overLight: false,
  mode: 'standard',
} as const;

export const QUALITY_PRESETS: Record<QualityLevel, Partial<LiquidGlassConfig>> = {
  high: {},
  medium: {
    blurAmount: 0.05,
    aberrationIntensity: 1,
  },
  dragging: {
    blurAmount: 0.0325,
    aberrationIntensity: 1,
    saturation: 120,
  },
  'low-power': {
    blurAmount: 0.02,
    aberrationIntensity: 0,
    displacementScale: 30,
  },
} as const;
