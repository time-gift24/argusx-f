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
  <!-- SVG Filter Defs (hidden) -->
  <svg class="liquid-filters" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter [id]="filterId()" x="-20%" y="-20%" width="140%" height="140%">
        <!-- feTurbulence 生成噪声 -->
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.01"
          numOctaves="3"
          result="noise"
        />
        <!-- feDisplacementMap 使用噪声位移内容 -->
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          [attr.scale]="config().displacementScale"
          xChannelSelector="R"
          yChannelSelector="G"
          result="displaced"
        />
      </filter>
    </defs>
  </svg>

  <!-- Glass Container -->
  <div
    class="liquid-glass-container"
    [style.backdrop-filter]="backdropFilter()"
    [style.-webkit-backdrop-filter]="backdropFilter()"
    [style.border-radius.px]="config().cornerRadius"
  >
    <!-- Highlight Layer -->
    <div class="liquid-highlight"></div>

    <!-- Content -->
    <div class="liquid-content">
      <ng-content />
    </div>
  </div>
`,
  styles: [`
  :host {
    display: block;
    position: relative;
  }

  .liquid-filters {
    position: absolute;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  .liquid-glass-container {
    position: relative;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .liquid-highlight {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.3) 0%,
      transparent 50%,
      rgba(255, 255, 255, 0.1) 100%
    );
    pointer-events: none;
  }

  .liquid-content {
    position: relative;
    z-index: 1;
  }
`],
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
