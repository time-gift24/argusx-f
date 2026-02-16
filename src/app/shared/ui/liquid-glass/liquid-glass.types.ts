export type LiquidMode = 'standard' | 'polar' | 'prominent' | 'shader';

export type QualityLevel = 'high' | 'medium' | 'dragging' | 'low-power';

export interface LiquidGlassConfig {
  displacementScale: number;
  blurAmount: number;
  saturation: number;
  aberrationIntensity: number;
  elasticity: number;
  cornerRadius: number;
  overLight: boolean;
  mode: LiquidMode;
}

export interface LiquidMouseState {
  x: number;
  y: number;
  isActive: boolean;
}

export interface LiquidDragState {
  isDragging: boolean;
  velocity: { x: number; y: number };
  position: { x: number; y: number };
}
