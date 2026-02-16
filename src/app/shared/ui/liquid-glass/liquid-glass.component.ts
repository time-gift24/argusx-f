// src/app/shared/ui/liquid-glass/liquid-glass.component.ts
import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import type { LiquidGlassConfig } from './liquid-glass.types';
import { DEFAULT_LIQUID_CONFIG } from './liquid-glass.config';

@Component({
  selector: 'app-liquid-glass',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <svg class="liquid-filters" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter
        [id]="filterId()"
        x="-35%"
        y="-35%"
        width="170%"
        height="170%"
        color-interpolation-filters="sRGB"
      >
        <feImage
          x="0"
          y="0"
          width="100%"
          height="100%"
          [attr.href]="displacementMapUrl()"
          preserveAspectRatio="xMidYMid slice"
          result="DISPLACEMENT_MAP"
        />

        <feColorMatrix
          in="DISPLACEMENT_MAP"
          type="matrix"
          values="0.3 0.3 0.3 0 0
                 0.3 0.3 0.3 0 0
                 0.3 0.3 0.3 0 0
                 0 0 0 1 0"
          result="EDGE_INTENSITY"
        />
        <feComponentTransfer in="EDGE_INTENSITY" result="EDGE_MASK">
          <feFuncA
            type="discrete"
            [attr.tableValues]="edgeMaskTableValues()"
          />
        </feComponentTransfer>

        <feOffset
          in="SourceGraphic"
          dx="0"
          dy="0"
          result="CENTER_ORIGINAL"
        />

        <feDisplacementMap
          in="SourceGraphic"
          in2="DISPLACEMENT_MAP"
          [attr.scale]="redDisplacementScale()"
          xChannelSelector="R"
          yChannelSelector="B"
          result="RED_DISPLACED"
        />
        <feColorMatrix
          in="RED_DISPLACED"
          type="matrix"
          values="1 0 0 0 0
                 0 0 0 0 0
                 0 0 0 0 0
                 0 0 0 1 0"
          result="RED_CHANNEL"
        />

        <feDisplacementMap
          in="SourceGraphic"
          in2="DISPLACEMENT_MAP"
          [attr.scale]="greenDisplacementScale()"
          xChannelSelector="R"
          yChannelSelector="B"
          result="GREEN_DISPLACED"
        />
        <feColorMatrix
          in="GREEN_DISPLACED"
          type="matrix"
          values="0 0 0 0 0
                 0 1 0 0 0
                 0 0 0 0 0
                 0 0 0 1 0"
          result="GREEN_CHANNEL"
        />

        <feDisplacementMap
          in="SourceGraphic"
          in2="DISPLACEMENT_MAP"
          [attr.scale]="blueDisplacementScale()"
          xChannelSelector="R"
          yChannelSelector="B"
          result="BLUE_DISPLACED"
        />
        <feColorMatrix
          in="BLUE_DISPLACED"
          type="matrix"
          values="0 0 0 0 0
                 0 0 0 0 0
                 0 0 1 0 0
                 0 0 0 1 0"
          result="BLUE_CHANNEL"
        />

        <feBlend
          in="GREEN_CHANNEL"
          in2="BLUE_CHANNEL"
          mode="screen"
          result="GB_COMBINED"
        />
        <feBlend
          in="RED_CHANNEL"
          in2="GB_COMBINED"
          mode="screen"
          result="RGB_COMBINED"
        />

        <feGaussianBlur
          in="RGB_COMBINED"
          [attr.stdDeviation]="aberrationBlurStdDeviation()"
          result="ABERRATED_BLURRED"
        />

        <feComposite
          in="ABERRATED_BLURRED"
          in2="EDGE_MASK"
          operator="in"
          result="EDGE_ABERRATION"
        />
        <feComponentTransfer in="EDGE_MASK" result="INVERTED_MASK">
          <feFuncA type="table" tableValues="1 0" />
        </feComponentTransfer>
        <feComposite
          in="CENTER_ORIGINAL"
          in2="INVERTED_MASK"
          operator="in"
          result="CENTER_CLEAN"
        />
        <feComposite in="EDGE_ABERRATION" in2="CENTER_CLEAN" operator="over" />
      </filter>
    </defs>
  </svg>

  <div
    class="liquid-glass-container"
    [style.border-radius.px]="config().cornerRadius"
    [style.transform]="elasticContainerTransform()"
  >
    <span
      class="liquid-warp"
      [style.filter]="displacementFilter()"
      [style.backdrop-filter]="backdropFilter()"
      [style.-webkit-backdrop-filter]="backdropFilter()"
    ></span>

    <div
      class="liquid-highlight"
    ></div>

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
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: visible;
  }

  .liquid-glass-container {
    position: relative;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transform-origin: center;
    transition: transform 0.2s ease-out;
  }

  .liquid-warp {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    z-index: 0;
  }

  .liquid-highlight {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    z-index: 1;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.28) 0%,
      transparent 50%,
      rgba(255, 255, 255, 0.08) 100%
    );
    pointer-events: none;
  }

  .liquid-content {
    position: relative;
    z-index: 2;
  }
`],
})
export class LiquidGlassComponent {
  private static readonly ACTIVATION_ZONE = 200;
  private static readonly MIN_SCALE = 0.8;
  private static readonly IDENTITY_TRANSFORM =
    'translate3d(0px, 0px, 0) scaleX(1) scaleY(1)';

  private readonly elementRef = inject(ElementRef<HTMLElement>);

  private static instanceCounter = 0;
  private readonly instanceId = LiquidGlassComponent.instanceCounter++;
  private readonly globalMousePos = signal<{ x: number; y: number }>({ x: 0, y: 0 });
  private readonly hasGlobalMouse = signal(false);

  readonly config = input<LiquidGlassConfig>(DEFAULT_LIQUID_CONFIG);

  readonly hoverStart = output<void>();
  readonly hoverEnd = output<void>();

  readonly filterId = computed(
    () => `liquid-filter-${this.instanceId}-${this.config().mode}`
  );

  readonly displacementFilter = computed(() => `url(#${this.filterId()})`);

  readonly elasticContainerTransform = computed(() => {
    const elasticity = this.config().elasticity;
    if (elasticity <= 0 || !this.hasGlobalMouse()) {
      return LiquidGlassComponent.IDENTITY_TRANSFORM;
    }

    const hostRect = this.elementRef.nativeElement.getBoundingClientRect();
    if (hostRect.width <= 0 || hostRect.height <= 0) {
      return LiquidGlassComponent.IDENTITY_TRANSFORM;
    }

    const { x, y } = this.globalMousePos();
    const centerX = hostRect.left + hostRect.width / 2;
    const centerY = hostRect.top + hostRect.height / 2;
    const deltaX = x - centerX;
    const deltaY = y - centerY;

    const edgeDistanceX = Math.max(0, Math.abs(deltaX) - hostRect.width / 2);
    const edgeDistanceY = Math.max(0, Math.abs(deltaY) - hostRect.height / 2);
    const edgeDistance = Math.hypot(edgeDistanceX, edgeDistanceY);

    if (edgeDistance > LiquidGlassComponent.ACTIVATION_ZONE) {
      return LiquidGlassComponent.IDENTITY_TRANSFORM;
    }

    const fadeInFactor = 1 - edgeDistance / LiquidGlassComponent.ACTIVATION_ZONE;
    const centerDistance = Math.hypot(deltaX, deltaY);
    if (centerDistance === 0) {
      return LiquidGlassComponent.IDENTITY_TRANSFORM;
    }

    const normalizedX = deltaX / centerDistance;
    const normalizedY = deltaY / centerDistance;
    const stretchIntensity =
      Math.min(centerDistance / 300, 1) * elasticity * fadeInFactor;

    const scaleX =
      1 +
      Math.abs(normalizedX) * stretchIntensity * 0.3 -
      Math.abs(normalizedY) * stretchIntensity * 0.15;
    const scaleY =
      1 +
      Math.abs(normalizedY) * stretchIntensity * 0.3 -
      Math.abs(normalizedX) * stretchIntensity * 0.15;

    const translateX = deltaX * elasticity * 0.1 * fadeInFactor;
    const translateY = deltaY * elasticity * 0.1 * fadeInFactor;

    return `translate3d(${translateX}px, ${translateY}px, 0) scaleX(${Math.max(
      LiquidGlassComponent.MIN_SCALE,
      scaleX
    )}) scaleY(${Math.max(LiquidGlassComponent.MIN_SCALE, scaleY)})`;
  });

  readonly displacementMapUrl = computed(() => {
    const { mode } = this.config();
    switch (mode) {
      case 'polar':
        return '/liquid-glass/displacement-polar.jpg';
      case 'prominent':
        return '/liquid-glass/displacement-prominent.png';
      case 'shader':
        return '/liquid-glass/displacement-standard.jpg';
      default:
        return '/liquid-glass/displacement-standard.jpg';
    }
  });

  readonly edgeMaskTableValues = computed(() => {
    const alphaBoost = this.config().aberrationIntensity * 0.05;
    return `0 ${alphaBoost} 1`;
  });

  readonly redDisplacementScale = computed(() => {
    const { displacementScale, mode } = this.config();
    const baseScale = mode === 'shader' ? 1 : -1;
    return displacementScale * baseScale;
  });

  readonly greenDisplacementScale = computed(() => {
    const { displacementScale, mode, aberrationIntensity } = this.config();
    const baseScale = mode === 'shader' ? 1 : -1;
    return displacementScale * (baseScale - aberrationIntensity * 0.05);
  });

  readonly blueDisplacementScale = computed(() => {
    const { displacementScale, mode, aberrationIntensity } = this.config();
    const baseScale = mode === 'shader' ? 1 : -1;
    return displacementScale * (baseScale - aberrationIntensity * 0.1);
  });

  readonly aberrationBlurStdDeviation = computed(() =>
    Math.max(0.1, 0.5 - this.config().aberrationIntensity * 0.1)
  );

  readonly backdropFilter = computed(() => {
    const { blurAmount, saturation, overLight } = this.config();
    const baseBlur = overLight ? 12 : 4;
    return `blur(${baseBlur + blurAmount * 32}px) saturate(${saturation}%)`;
  });

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.hoverStart.emit();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.globalMousePos.set({ x: event.clientX, y: event.clientY });
    this.hasGlobalMouse.set(true);
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.hasGlobalMouse.set(false);
    this.hoverEnd.emit();
  }
}
