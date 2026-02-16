import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LiquidGlassComponent,
  LiquidMouseDirective,
  LiquidGlassConfig,
} from '../shared/ui/liquid-glass';

@Component({
  selector: 'app-liquid-glass-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, LiquidGlassComponent, LiquidMouseDirective],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-8">
      <!-- Background Elements -->
      <div class="fixed top-20 left-20 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl"></div>
      <div class="fixed bottom-20 right-20 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl"></div>

      <div class="mx-auto max-w-6xl">
        <h1 class="mb-2 text-2xl font-semibold text-white">Liquid Glass</h1>
        <p class="mb-8 text-white/70">
          Apple-style liquid glass effect with refraction, blur, and elastic interaction.
        </p>

        <!-- Configuration Panel -->
        <section class="mb-8">
          <div class="mb-4">
            <h2 class="text-sm font-medium text-white/90">Configuration</h2>
          </div>
          <div class="rounded-lg border border-white/20 bg-black/20 p-6">
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="mb-2 block text-xs text-white/70">Displacement Scale</label>
                <input
                  type="range"
                  [(ngModel)]="config().displacementScale"
                  [min]="0"
                  [max]="200"
                  class="w-full"
                />
                <span class="text-xs text-white/50">{{ config().displacementScale }}</span>
              </div>
              <div>
                <label class="mb-2 block text-xs text-white/70">Blur Amount</label>
                <input
                  type="range"
                  [(ngModel)]="config().blurAmount"
                  [min]="0"
                  [max]="0.2"
                  step="0.01"
                  class="w-full"
                />
                <span class="text-xs text-white/50">{{ config().blurAmount }}</span>
              </div>
              <div>
                <label class="mb-2 block text-xs text-white/70">Saturation</label>
                <input
                  type="range"
                  [(ngModel)]="config().saturation"
                  [min]="100"
                  [max]="300"
                  class="w-full"
                />
                <span class="text-xs text-white/50">{{ config().saturation }}%</span>
              </div>
              <div>
                <label class="mb-2 block text-xs text-white/70">Chromatic Aberration</label>
                <input
                  type="range"
                  [(ngModel)]="config().aberrationIntensity"
                  [min]="0"
                  [max]="20"
                  class="w-full"
                />
                <span class="text-xs text-white/50">{{ config().aberrationIntensity }}</span>
              </div>
              <div>
                <label class="mb-2 block text-xs text-white/70">Elasticity</label>
                <input
                  type="range"
                  [(ngModel)]="config().elasticity"
                  [min]="0"
                  [max]="1"
                  step="0.05"
                  class="w-full"
                />
                <span class="text-xs text-white/50">{{ config().elasticity }}</span>
              </div>
              <div>
                <label class="mb-2 block text-xs text-white/70">Corner Radius</label>
                <input
                  type="range"
                  [(ngModel)]="config().cornerRadius"
                  [min]="0"
                  [max]="100"
                  class="w-full"
                />
                <span class="text-xs text-white/50">{{ config().cornerRadius }}px</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Basic Card Example -->
        <section class="mb-8">
          <div class="mb-4">
            <h2 class="text-sm font-medium text-white/90">Basic Card</h2>
          </div>
          <div class="rounded-lg border border-white/20 bg-black/20 p-6">
            <div class="max-w-md">
              <app-liquid-glass
                appLiquidMouse
                [config]="config()"
                class="block"
              >
                <div class="p-6 text-white">
                  <h3 class="mb-2 text-xl font-semibold">Liquid Glass Card</h3>
                  <p class="mb-4 text-white/80">
                    This is a glass morphism card with refraction effects.
                    Move your mouse to see the elastic interaction.
                  </p>
                  <div class="flex gap-3">
                    <button class="rounded-lg bg-white/20 px-4 py-2 transition hover:bg-white/30">
                      Learn More
                    </button>
                    <button class="rounded-lg bg-white/10 px-4 py-2 transition hover:bg-white/20">
                      Contact
                    </button>
                  </div>
                </div>
              </app-liquid-glass>
            </div>
          </div>
        </section>

        <!-- Button Example -->
        <section class="mb-8">
          <div class="mb-4">
            <h2 class="text-sm font-medium text-white/90">Button</h2>
          </div>
          <div class="rounded-lg border border-white/20 bg-black/20 p-6">
            <div class="flex gap-4">
              <app-liquid-glass
                appLiquidMouse
                [config]="buttonConfig()"
                class="inline-block"
              >
                <button class="px-6 py-2 text-white">Click Me</button>
              </app-liquid-glass>
              <app-liquid-glass
                appLiquidMouse
                [config]="lightButtonConfig()"
                class="inline-block"
              >
                <button class="px-6 py-2 text-gray-900">Light Mode</button>
              </app-liquid-glass>
            </div>
          </div>
        </section>

        <!-- Multiple Cards -->
        <section class="mb-8">
          <div class="mb-4">
            <h2 class="text-sm font-medium text-white/90">Multiple Instances</h2>
          </div>
          <div class="rounded-lg border border-white/20 bg-black/20 p-6">
            <div class="grid grid-cols-2 gap-6">
              <app-liquid-glass
                appLiquidMouse
                [config]="cardConfig()"
                class="block"
              >
                <div class="p-4 text-white">
                  <h4 class="font-medium">Card One</h4>
                  <p class="text-sm text-white/70">Multiple instances work independently.</p>
                </div>
              </app-liquid-glass>
              <app-liquid-glass
                appLiquidMouse
                [config]="cardConfig()"
                class="block"
              >
                <div class="p-4 text-white">
                  <h4 class="font-medium">Card Two</h4>
                  <p class="text-sm text-white/70">Each has its own mouse tracking.</p>
                </div>
              </app-liquid-glass>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class LiquidGlassPreviewComponent {
  config = signal<LiquidGlassConfig>({
    displacementScale: 70,
    blurAmount: 0.0625,
    saturation: 140,
    aberrationIntensity: 2,
    elasticity: 0.15,
    cornerRadius: 24,
    overLight: false,
    mode: 'standard',
  });

  buttonConfig = computed(() => ({
    ...this.config(),
    cornerRadius: 100,
  }));

  lightButtonConfig = computed(() => ({
    ...this.config(),
    cornerRadius: 100,
    overLight: true,
  }));

  cardConfig = computed(() => ({
    ...this.config(),
    cornerRadius: 16,
  }));
}
