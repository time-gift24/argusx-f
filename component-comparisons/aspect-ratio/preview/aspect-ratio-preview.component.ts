import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AspectRatioComponent } from './aspect-ratio.component';

@Component({
  selector: 'app-aspect-ratio-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AspectRatioComponent],
  template: `
    <div class="mx-auto max-w-3xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Aspect Ratio</h1>
      <p class="mb-8 text-muted-foreground">
        Displays content within a desired width-to-height ratio. Useful for images, videos, and embedded content.
      </p>

      <section class="mb-8">
        <h2 class="mb-4 text-lg font-semibold">16:9 vs 21:9 Comparison</h2>
        <p class="mb-4 text-sm text-muted-foreground">
          Two containers with same width but different aspect ratios.
        </p>
        <div class="flex gap-8">
          <!-- 16:9 -->
          <div class="flex-1">
            <p class="mb-2 text-sm font-medium">16:9</p>
            <div class="w-80 border border-dashed border-muted-foreground/30 p-4">
              <app-aspect-ratio [ratio]="16 / 9" class="rounded-lg">
                <div class="flex h-full w-full items-center justify-center rounded-lg bg-muted">
                  <span class="text-muted-foreground text-sm">16 / 9</span>
                </div>
              </app-aspect-ratio>
            </div>
          </div>
          <!-- 21:9 -->
          <div class="flex-1">
            <p class="mb-2 text-sm font-medium">21:9</p>
            <div class="w-80 border border-dashed border-muted-foreground/30 p-4">
              <app-aspect-ratio [ratio]="21 / 9" class="rounded-lg">
                <div class="flex h-full w-full items-center justify-center rounded-lg bg-muted">
                  <span class="text-muted-foreground text-sm">21 / 9</span>
                </div>
              </app-aspect-ratio>
            </div>
          </div>
        </div>
      </section>

      <section class="mb-8">
        <h2 class="mb-4 text-lg font-semibold">With Image</h2>
        <p class="mb-2 text-sm text-muted-foreground">
          Use with img[object-cover] to fill the container.
        </p>
        <app-aspect-ratio [ratio]="16 / 9" class="rounded-lg">
          <img
            src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
            alt="Photo by Drew Beamer"
            class="h-full w-full rounded-lg object-cover"
          />
        </app-aspect-ratio>
      </section>

      <section class="mb-8">
        <h2 class="mb-4 text-lg font-semibold">Square (1:1) - Avatar</h2>
        <app-aspect-ratio [ratio]="1" class="w-32 rounded-lg">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"
            alt="User avatar"
            class="h-full w-full rounded-lg object-cover"
          />
        </app-aspect-ratio>
      </section>

      <section class="mb-8">
        <h2 class="mb-4 text-lg font-semibold">All Common Ratios</h2>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <p class="mb-2 text-sm text-muted-foreground">4:3</p>
            <app-aspect-ratio [ratio]="4 / 3" class="rounded-lg">
              <div class="flex h-full w-full items-center justify-center bg-muted">
                <span class="text-muted-foreground text-sm">4/3</span>
              </div>
            </app-aspect-ratio>
          </div>
          <div>
            <p class="mb-2 text-sm text-muted-foreground">1:1</p>
            <app-aspect-ratio [ratio]="1" class="rounded-lg">
              <div class="flex h-full w-full items-center justify-center bg-muted">
                <span class="text-muted-foreground text-sm">1/1</span>
              </div>
            </app-aspect-ratio>
          </div>
          <div>
            <p class="mb-2 text-sm text-muted-foreground">9:16</p>
            <app-aspect-ratio [ratio]="9 / 16" class="rounded-lg">
              <div class="flex h-full w-full items-center justify-center bg-muted">
                <span class="text-muted-foreground text-sm">9/16</span>
              </div>
            </app-aspect-ratio>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class AspectRatioPreviewComponent {}
