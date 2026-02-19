import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ArgusxAspectRatioComponent } from '@app/shared/ui/aspect-ratio';

type RatioExample = {
  label: string;
  ratio: number | string;
  hint: string;
};

@Component({
  selector: 'app-aspect-ratio-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArgusxAspectRatioComponent],
  template: `
    <div class="mx-auto max-w-5xl space-y-8 p-8">
      <header>
        <h1 class="mb-2 text-2xl font-semibold">Aspect Ratio</h1>
        <p class="text-muted-foreground">
          Shadcn-aligned ratio container with ArgusX plain extensions for neutral styling and media fit control.
        </p>
      </header>

      <section class="space-y-3">
        <h2 class="text-sm font-medium text-muted-foreground">Shadcn Baseline (ratio + class)</h2>
        <argusx-aspect-ratio [ratio]="16 / 9" class="overflow-hidden rounded-lg border border-border bg-muted">
          <img
            src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=1200&q=80"
            alt="Landscape preview"
            class="h-full w-full object-cover"
            loading="lazy"
          />
        </argusx-aspect-ratio>
      </section>

      <section class="space-y-3">
        <h2 class="text-sm font-medium text-muted-foreground">
          Plain Extension (variant + fit)
        </h2>
        <div class="grid gap-4 md:grid-cols-2">
          <article class="space-y-2 rounded-lg border border-dashed border-border p-4">
            <p class="text-xs text-muted-foreground">
              <code>variant="subtle"</code> + <code>fit="cover"</code>
            </p>
            <argusx-aspect-ratio [ratio]="4 / 3" variant="subtle" fit="cover">
              <img
                src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&q=80"
                alt="Cover fit sample"
                class="h-full w-full"
                loading="lazy"
              />
            </argusx-aspect-ratio>
          </article>

          <article class="space-y-2 rounded-lg border border-dashed border-border p-4">
            <p class="text-xs text-muted-foreground">
              <code>variant="subtle"</code> + <code>fit="contain"</code>
            </p>
            <argusx-aspect-ratio [ratio]="4 / 3" variant="subtle" fit="contain">
              <img
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80"
                alt="Contain fit sample"
                class="h-full w-full bg-muted"
                loading="lazy"
              />
            </argusx-aspect-ratio>
          </article>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-sm font-medium text-muted-foreground">Key Ratio States</h2>
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          @for (example of ratioExamples; track example.label) {
            <article class="space-y-2 rounded-lg border border-dashed border-border p-4">
              <p class="text-xs font-medium">{{ example.label }}</p>
              <argusx-aspect-ratio [ratio]="example.ratio" class="rounded-md border border-border bg-muted/30">
                <div class="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                  {{ example.hint }}
                </div>
              </argusx-aspect-ratio>
            </article>
          }
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-sm font-medium text-muted-foreground">Complex Composition</h2>
        <div class="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <argusx-aspect-ratio
            [ratio]="21 / 9"
            variant="subtle"
            fit="cover"
            class="rounded-xl border border-border"
          >
            <img
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1400&q=80"
              alt="Wide hero sample"
              class="h-full w-full"
              loading="lazy"
            />
          </argusx-aspect-ratio>

          <argusx-aspect-ratio
            ratio="1 / 1"
            variant="subtle"
            fit="contain"
            class="rounded-xl border border-border bg-muted/30 p-4"
          >
            <img
              src="https://images.unsplash.com/photo-1552410260-0fd9b577afa6?w=1200&q=80"
              alt="Square secondary sample"
              class="h-full w-full"
              loading="lazy"
            />
          </argusx-aspect-ratio>
        </div>
      </section>
    </div>
  `,
})
export class AspectRatioPreviewComponent {
  protected readonly ratioExamples: readonly RatioExample[] = [
    { label: 'Square 1:1', ratio: 1, hint: 'Balanced avatar/media frame' },
    { label: 'Portrait 3:4', ratio: 3 / 4, hint: 'Document-style visual' },
    { label: 'Landscape 16:9', ratio: 16 / 9, hint: 'Video and hero media' },
    { label: 'Invalid Ratio Fallback', ratio: '0', hint: 'Fallbacks to 1:1 plain' },
  ];
}
