import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CarouselComponent, CarouselItemComponent } from '@app/shared/ui/carousel';

@Component({
  selector: 'app-carousel-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CarouselComponent, CarouselItemComponent],
  template: `
    <div class="mx-auto max-w-3xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Carousel</h1>
      <p class="mb-8 text-muted-foreground">
        A carousel component for cycling through content like images or slides.
      </p>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Default</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <app-carousel class="w-full max-w-xs">
            <app-carousel-item>
              <div class="aspect-square rounded-md bg-muted p-6 flex items-center justify-center">
                <span class="text-2xl font-semibold">1</span>
              </div>
            </app-carousel-item>
            <app-carousel-item>
              <div class="aspect-square rounded-md bg-muted p-6 flex items-center justify-center">
                <span class="text-2xl font-semibold">2</span>
              </div>
            </app-carousel-item>
            <app-carousel-item>
              <div class="aspect-square rounded-md bg-muted p-6 flex items-center justify-center">
                <span class="text-2xl font-semibold">3</span>
              </div>
            </app-carousel-item>
          </app-carousel>
        </div>
      </section>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Multiple Items</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <app-carousel class="w-full max-w-sm" [opts]="{ align: 'start' }">
            <app-carousel-item class="basis-1/2">
              <div class="aspect-square rounded-md bg-muted p-4 flex items-center justify-center">
                <span class="text-lg font-semibold">1</span>
              </div>
            </app-carousel-item>
            <app-carousel-item class="basis-1/2">
              <div class="aspect-square rounded-md bg-muted p-4 flex items-center justify-center">
                <span class="text-lg font-semibold">2</span>
              </div>
            </app-carousel-item>
            <app-carousel-item class="basis-1/2">
              <div class="aspect-square rounded-md bg-muted p-4 flex items-center justify-center">
                <span class="text-lg font-semibold">3</span>
              </div>
            </app-carousel-item>
            <app-carousel-item class="basis-1/2">
              <div class="aspect-square rounded-md bg-muted p-4 flex items-center justify-center">
                <span class="text-lg font-semibold">4</span>
              </div>
            </app-carousel-item>
          </app-carousel>
        </div>
      </section>
    </div>
  `,
})
export class CarouselPreviewComponent {}
