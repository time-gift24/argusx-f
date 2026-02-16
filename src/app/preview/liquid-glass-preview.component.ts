import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
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
    <div class="min-h-screen bg-zinc-200 p-4 md:p-8">
      <div class="mx-auto grid h-[calc(100vh-2rem)] max-h-[calc(100vh-5rem)] w-full max-w-5xl grid-cols-1 grid-rows-[1fr_auto] overflow-hidden rounded-3xl shadow-2xl md:grid-cols-3 md:grid-rows-1">
        <div class="relative min-h-0 overflow-auto md:col-span-2">
          <div class="absolute inset-x-0 top-0 min-h-[200vh] pb-96">
            <img src="https://picsum.photos/2000/2000" class="h-96 w-full object-cover" />
            <div class="flex flex-col gap-2" id="bright-section">
              <h2 class="my-5 text-center text-3xl font-semibold text-black/80">Some Heading</h2>
              <p class="px-10 text-black/70">
                Bacon ipsum dolor amet hamburger Bacon ipsum dolor amet hamburger<br />
                Bacon ipsum dolor amet hamburger Bacon ipsum dolor amet hamburger<br />
                Bacon ipsum dolor amet hamburger Bacon ipsum dolor amet hamburger<br />
                Bacon ipsum dolor amet hamburger Bacon ipsum dolor amet hamburger<br />
                Bacon ipsum dolor amet hamburger Bacon ipsum dolor amet hamburger<br />
                Bacon ipsum dolor amet hamburger Bacon ipsum dolor amet hamburger
              </p>
            </div>
            <img src="https://picsum.photos/1200/1200" class="my-10 h-80 w-full object-cover" />
            <img src="https://picsum.photos/1400/1300" class="my-10 h-72 w-full object-cover" />
            <img src="https://picsum.photos/1100/1200" class="my-10 mb-96 h-96 w-full object-cover" />
          </div>

          <div class="fixed left-[40%] top-[25%] z-20 -translate-x-1/2 -translate-y-1/2">
            <div class="flex w-[352px] flex-col gap-4">
              <app-liquid-glass
                appLiquidMouse
                [config]="config()"
                class="block w-full"
              >
                <div class="p-6 text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.35)]">
                  <h3 class="mb-4 text-3xl font-semibold">User Info</h3>
                  <div class="space-y-3">
                    <div class="flex items-center gap-3">
                      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-black/15 text-xl font-semibold">JD</div>
                      <div>
                        <p class="font-medium">John Doe</p>
                        <p class="text-sm text-white/85">Software Engineer</p>
                      </div>
                    </div>
                    <div class="space-y-2 pt-2 text-sm">
                      <div class="flex justify-between">
                        <span class="text-white/80">Email:</span>
                        <span>john.doe@example.com</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-white/80">Location:</span>
                        <span>San Francisco, CA</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-white/80">Joined:</span>
                        <span>March 2023</span>
                      </div>
                    </div>
                  </div>
                </div>
              </app-liquid-glass>

              <app-liquid-glass
                appLiquidMouse
                [config]="config()"
                [solidBorder]="true"
                [solidBorderWidth]="2"
                solidBorderColor="rgba(96, 165, 250, 0.85)"
                solidBorderHighlightColor="rgba(147, 197, 253, 1)"
                solidBorderGlowColor="rgba(59, 130, 246, 0.55)"
                class="block w-full"
              >
                <div class="p-4 text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.35)]">
                  <label
                    for="user-info-note-input"
                    class="mb-2 block text-sm font-medium text-white/85"
                  >
                    Quick Note
                  </label>
                  <input
                    id="user-info-note-input"
                    type="text"
                    placeholder="Type something here..."
                    class="w-full rounded-xl border border-sky-300/45 bg-sky-500/10 px-3 py-2 text-sm text-white placeholder:text-sky-100/65 outline-none transition focus:border-sky-200 focus:bg-sky-500/20"
                  />
                </div>
              </app-liquid-glass>
            </div>
          </div>
        </div>

        <div class="row-start-2 h-full overflow-y-auto border-l border-white/10 bg-gray-900/80 p-6 backdrop-blur-md md:col-start-3 md:row-start-1">
          <h2 class="mb-2 text-2xl font-bold text-white">Glassy Boi but Web</h2>
          <p class="mb-6 text-sm text-white/60">
            Liquid Glass container effect preview. Tune parameters to inspect
            displacement, blur and chromatic behavior.
          </p>

          <div class="space-y-5">
          <!-- Displacement Scale -->
          <div>
            <label class="mb-2 block text-sm font-semibold text-white/90">Displacement Scale</label>
            <input
              type="range"
              [ngModel]="config().displacementScale"
              (ngModelChange)="updateConfig('displacementScale', $event)"
              [min]="0"
              [max]="200"
              class="w-full accent-blue-400"
            />
            <span class="text-xs text-white/55">{{ config().displacementScale }}</span>
          </div>

          <!-- Blur Amount -->
          <div>
            <label class="mb-2 block text-sm font-semibold text-white/90">Blur Amount</label>
            <input
              type="range"
              [ngModel]="config().blurAmount"
              (ngModelChange)="updateConfig('blurAmount', $event)"
              [min]="0"
              [max]="1"
              step="0.01"
              class="w-full accent-blue-400"
            />
            <span class="text-xs text-white/55">{{ config().blurAmount }}</span>
          </div>

          <!-- Saturation -->
          <div>
            <label class="mb-2 block text-sm font-semibold text-white/90">Saturation</label>
            <input
              type="range"
              [ngModel]="config().saturation"
              (ngModelChange)="updateConfig('saturation', $event)"
              [min]="100"
              [max]="300"
              class="w-full accent-blue-400"
            />
            <span class="text-xs text-white/55">{{ config().saturation }}%</span>
          </div>

          <!-- Chromatic Aberration -->
          <div>
            <label class="mb-2 block text-sm font-semibold text-white/90">Chromatic Aberration</label>
            <input
              type="range"
              [ngModel]="config().aberrationIntensity"
              (ngModelChange)="updateConfig('aberrationIntensity', $event)"
              [min]="0"
              [max]="20"
              class="w-full accent-blue-400"
            />
            <span class="text-xs text-white/55">{{ config().aberrationIntensity }}</span>
          </div>

          <!-- Elasticity -->
          <div>
            <label class="mb-2 block text-sm font-semibold text-white/90">Elasticity</label>
            <input
              type="range"
              [ngModel]="config().elasticity"
              (ngModelChange)="updateConfig('elasticity', $event)"
              [min]="0"
              [max]="1"
              step="0.05"
              class="w-full accent-blue-400"
            />
            <span class="text-xs text-white/55">{{ config().elasticity }}</span>
          </div>

          <!-- Corner Radius -->
          <div>
            <label class="mb-2 block text-sm font-semibold text-white/90">Corner Radius</label>
            <input
              type="range"
              [ngModel]="config().cornerRadius"
              (ngModelChange)="updateConfig('cornerRadius', $event)"
              [min]="0"
              [max]="100"
              class="w-full accent-blue-400"
            />
            <span class="text-xs text-white/55">{{ config().cornerRadius }}px</span>
          </div>

          <!-- Mode -->
          <div>
            <label class="mb-2 block text-sm font-semibold text-white/90">Mode</label>
            <select
              [ngModel]="config().mode"
              (ngModelChange)="updateConfig('mode', $event)"
              class="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white"
            >
              <option value="standard">Standard</option>
              <option value="polar">Polar</option>
              <option value="prominent">Prominent</option>
              <option value="shader">Shader</option>
            </select>
          </div>

          <!-- Over Light -->
          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              [ngModel]="config().overLight"
              (ngModelChange)="updateConfig('overLight', $event)"
              id="overLight"
              class="rounded"
            />
            <label for="overLight" class="text-xs text-white/60">Over Light (for bright backgrounds)</label>
          </div>
          </div>

          <h3 class="mb-3 mt-6 text-xs font-medium uppercase tracking-wide text-white/50">Presets</h3>
          <div class="space-y-2">
            <button
              (click)="applyPreset('default')"
              class="w-full rounded-md border border-white/15 px-3 py-2 text-left text-xs text-white/85 transition hover:bg-white/10"
            >
              Default
            </button>
            <button
              (click)="applyPreset('frosted')"
              class="w-full rounded-md border border-white/15 px-3 py-2 text-left text-xs text-white/85 transition hover:bg-white/10"
            >
              Heavy Frosted
            </button>
            <button
              (click)="applyPreset('subtle')"
              class="w-full rounded-md border border-white/15 px-3 py-2 text-left text-xs text-white/85 transition hover:bg-white/10"
            >
              Subtle
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LiquidGlassPreviewComponent {
  config = signal<LiquidGlassConfig>({
    displacementScale: 100,
    blurAmount: 0.5,
    saturation: 140,
    aberrationIntensity: 2,
    elasticity: 0,
    cornerRadius: 32,
    overLight: false,
    mode: 'standard',
  });

  updateConfig<K extends keyof LiquidGlassConfig>(
    key: K,
    value: LiquidGlassConfig[K]
  ): void {
    this.config.update(
      (current) => ({ ...current, [key]: value }) as LiquidGlassConfig
    );
  }

  applyPreset(preset: 'default' | 'frosted' | 'subtle'): void {
    const presets = {
      default: {
        displacementScale: 100,
        blurAmount: 0.5,
        saturation: 140,
        aberrationIntensity: 2,
        elasticity: 0,
        cornerRadius: 32,
        overLight: false,
        mode: 'standard' as const,
      },
      frosted: {
        displacementScale: 120,
        blurAmount: 0.15,
        saturation: 180,
        aberrationIntensity: 5,
        elasticity: 0.3,
        cornerRadius: 32,
        overLight: false,
        mode: 'prominent' as const,
      },
      subtle: {
        displacementScale: 30,
        blurAmount: 0.03,
        saturation: 110,
        aberrationIntensity: 0,
        elasticity: 0.05,
        cornerRadius: 12,
        overLight: false,
        mode: 'standard' as const,
      },
    };
    this.config.set(presets[preset]);
  }
}
