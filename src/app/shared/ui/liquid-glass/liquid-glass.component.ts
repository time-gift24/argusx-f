// src/app/shared/ui/liquid-glass/liquid-glass.component.ts
import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import type { LiquidGlassConfig } from './liquid-glass.types';
import { DEFAULT_LIQUID_CONFIG } from './liquid-glass.config';

@Component({
  selector: 'app-liquid-glass',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--liquid-blur]': 'config().blurAmount',
    '[style.--liquid-saturation]': '`${config().saturation}%`',
    '[style.--liquid-radius]': '`${config().cornerRadius}px`',
    '[style.--liquid-mouse-x]': 'mousePosition().x + "px"',
    '[style.--liquid-mouse-y]': 'mousePosition().y + "px"',
  },
  template: `
    <div class="liquid-glass-wrapper">
      <ng-content />
    </div>
  `,
})
export class LiquidGlassComponent {
  readonly config = input<LiquidGlassConfig>(DEFAULT_LIQUID_CONFIG);
  readonly mousePosition = input<{ x: number; y: number }>({ x: 0, y: 0 });

  readonly hoverStart = output<void>();
  readonly hoverEnd = output<void>();

  readonly filterId = computed(() => `liquid-filter-${this.config().mode}`);

  readonly backdropFilter = computed(() => {
    const { blurAmount, saturation } = this.config();
    return `blur(${blurAmount * 100}%) saturate(${saturation}%)`;
  });
}
