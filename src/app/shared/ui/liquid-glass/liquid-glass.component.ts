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

interface ElasticMetrics {
  translateX: number;
  translateY: number;
  scaleX: number;
  scaleY: number;
  stretchIntensity: number;
  isActive: boolean;
}

@Component({
  selector: 'app-liquid-glass',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--liquid-corner]': 'liquidCornerCssValue()',
  },
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
    class="liquid-frame"
    [style.transform]="elasticContainerTransform()"
    [style.border-radius]="liquidCornerCssValue()"
  >
    <div
      class="liquid-shell"
      [style.border-radius]="liquidCornerCssValue()"
    >
      <div
        class="liquid-glass-container"
        [style.border-width.px]="containerBorderWidth()"
        [style.border-color]="containerBorderColor()"
        [style.border-radius]="liquidCornerCssValue()"
      >
        <span
          class="liquid-warp"
          [style.filter]="displacementFilter()"
          [style.backdrop-filter]="backdropFilter()"
          [style.-webkit-backdrop-filter]="backdropFilter()"
          [style.border-radius]="liquidCornerCssValue()"
          [style.clip-path]="liquidCornerClipPath()"
          [style.-webkit-clip-path]="liquidCornerClipPath()"
        ></span>

        <div
          class="liquid-highlight"
          [style.border-radius]="liquidCornerCssValue()"
          [style.clip-path]="liquidCornerClipPath()"
          [style.-webkit-clip-path]="liquidCornerClipPath()"
        ></div>

        <div class="liquid-content">
          <ng-content />
        </div>
      </div>
    </div>

    @if (solidBorder()) {
      <span
        class="liquid-solid-border"
        [style.border-width.px]="effectiveSolidBorderWidth()"
        [style.border-color]="effectiveSolidBorderColor()"
        [style.box-shadow]="effectiveSolidBorderGlow()"
        [style.border-radius]="liquidCornerCssValue()"
      ></span>
    }
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

  .liquid-frame {
    position: relative;
    border-radius: var(--liquid-corner, 0px);
    transform-origin: center;
    transition:
      transform 0.2s ease-out,
      border-radius 0.2s ease-out;
  }

  .liquid-shell {
    position: relative;
    border-radius: inherit;
    overflow: hidden;
  }

  .liquid-glass-container {
    position: relative;
    border-radius: inherit;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition:
      border-color 0.2s ease-out,
      border-radius 0.2s ease-out;
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

  .liquid-solid-border {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    border-style: solid;
    box-sizing: border-box;
    pointer-events: none;
    z-index: 5;
    transition:
      border-color 0.2s ease-out,
      border-radius 0.2s ease-out,
      box-shadow 0.2s ease-out;
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
  private static readonly MIN_CORNER_RATIO = 0.62;
  private static readonly MAX_CORNER_COMPRESSION = 0.34;
  private static readonly IDENTITY_TRANSFORM = 'none';
  private static readonly IDENTITY_METRICS: ElasticMetrics = {
    translateX: 0,
    translateY: 0,
    scaleX: 1,
    scaleY: 1,
    stretchIntensity: 0,
    isActive: false,
  };

  private readonly elementRef = inject(ElementRef<HTMLElement>);

  private static instanceCounter = 0;
  private readonly instanceId = LiquidGlassComponent.instanceCounter++;
  private readonly globalMousePos = signal<{ x: number; y: number }>({ x: 0, y: 0 });
  private readonly hasGlobalMouse = signal(false);
  private readonly isHovered = signal(false);
  private readonly hasFocusWithin = signal(false);

  readonly config = input<LiquidGlassConfig>(DEFAULT_LIQUID_CONFIG);
  readonly solidBorder = input(false);
  readonly solidBorderWidth = input(2);
  readonly solidBorderColor = input('rgba(255, 255, 255, 0.75)');
  readonly solidBorderHighlightColor = input('rgba(255, 255, 255, 1)');
  readonly solidBorderGlowColor = input('rgba(255, 255, 255, 0.45)');

  readonly hoverStart = output<void>();
  readonly hoverEnd = output<void>();

  readonly filterId = computed(
    () => `liquid-filter-${this.instanceId}-${this.config().mode}`
  );

  readonly displacementFilter = computed(() => `url(#${this.filterId()})`);
  readonly isSolidBorderHighlighted = computed(
    () => this.isHovered() || this.hasFocusWithin()
  );

  readonly containerBorderWidth = computed(() => (this.solidBorder() ? 0 : 1));

  readonly containerBorderColor = computed(() =>
    this.solidBorder() ? 'transparent' : 'rgba(255, 255, 255, 0.2)'
  );

  readonly effectiveSolidBorderWidth = computed(() =>
    this.solidBorder() ? Math.max(1, this.solidBorderWidth()) : 0
  );

  readonly effectiveSolidBorderColor = computed(() => {
    if (!this.solidBorder()) {
      return 'transparent';
    }

    if (this.isSolidBorderHighlighted()) {
      return this.solidBorderHighlightColor();
    }

    return this.solidBorderColor();
  });

  readonly effectiveSolidBorderGlow = computed(() => {
    if (!this.solidBorder() || !this.isSolidBorderHighlighted()) {
      return 'none';
    }

    return `0 0 0 1px ${this.solidBorderHighlightColor()}, 0 0 16px ${this.solidBorderGlowColor()}`;
  });

  readonly elasticMetrics = computed<ElasticMetrics>(() => {
    const elasticity = this.config().elasticity;
    if (elasticity <= 0 || !this.hasGlobalMouse()) {
      return LiquidGlassComponent.IDENTITY_METRICS;
    }

    const hostRect = this.elementRef.nativeElement.getBoundingClientRect();
    if (hostRect.width <= 0 || hostRect.height <= 0) {
      return LiquidGlassComponent.IDENTITY_METRICS;
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
      return LiquidGlassComponent.IDENTITY_METRICS;
    }

    const fadeInFactor = 1 - edgeDistance / LiquidGlassComponent.ACTIVATION_ZONE;
    const centerDistance = Math.hypot(deltaX, deltaY);
    if (centerDistance === 0) {
      return LiquidGlassComponent.IDENTITY_METRICS;
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

    return {
      translateX,
      translateY,
      scaleX: Math.max(LiquidGlassComponent.MIN_SCALE, scaleX),
      scaleY: Math.max(LiquidGlassComponent.MIN_SCALE, scaleY),
      stretchIntensity,
      isActive: true,
    };
  });

  readonly elasticContainerTransform = computed(() => {
    const metrics = this.elasticMetrics();
    if (!metrics.isActive) {
      return LiquidGlassComponent.IDENTITY_TRANSFORM;
    }

    return `translate3d(${metrics.translateX}px, ${metrics.translateY}px, 0) scaleX(${metrics.scaleX}) scaleY(${metrics.scaleY})`;
  });

  readonly effectiveCornerRadius = computed(() => {
    const baseRadius = this.config().cornerRadius;
    if (baseRadius <= 0) {
      return 0;
    }

    const metrics = this.elasticMetrics();
    if (!metrics.isActive) {
      return baseRadius;
    }

    const squeezeRatio = Math.min(metrics.scaleX, metrics.scaleY);
    const intensityFactor =
      1 -
      Math.min(
        LiquidGlassComponent.MAX_CORNER_COMPRESSION,
        metrics.stretchIntensity * 0.55
      );
    const cornerRatio = Math.max(
      LiquidGlassComponent.MIN_CORNER_RATIO,
      Math.min(1, squeezeRatio * intensityFactor)
    );

    return Math.max(2, baseRadius * cornerRatio);
  });

  readonly liquidCornerCssValue = computed(
    () => `${this.effectiveCornerRadius()}px`
  );
  readonly liquidCornerClipPath = computed(
    () => `inset(0 round ${this.liquidCornerCssValue()})`
  );

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
    this.isHovered.set(true);
    this.hoverStart.emit();
  }

  @HostListener('window:mousemove', ['$event'])
  onWindowMouseMove(event: MouseEvent): void {
    this.globalMousePos.set({ x: event.clientX, y: event.clientY });
    this.hasGlobalMouse.set(true);
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.isHovered.set(false);
    this.hoverEnd.emit();
  }

  @HostListener('window:mouseleave')
  onWindowMouseLeave(): void {
    this.hasGlobalMouse.set(false);
  }

  @HostListener('focusin')
  onFocusIn(): void {
    this.hasFocusWithin.set(true);
  }

  @HostListener('focusout')
  onFocusOut(): void {
    queueMicrotask(() => {
      this.hasFocusWithin.set(this.elementRef.nativeElement.matches(':focus-within'));
    });
  }
}
