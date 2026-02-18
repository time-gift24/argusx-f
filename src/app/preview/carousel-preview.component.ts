import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CarouselComponent,
  CarouselContentComponent,
  CarouselItemComponent,
  CarouselNextComponent,
  CarouselPreviousComponent,
} from '@app/shared/ui/carousel';

@Component({
  selector: 'app-carousel-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CarouselComponent,
    CarouselContentComponent,
    CarouselItemComponent,
    CarouselPreviousComponent,
    CarouselNextComponent,
  ],
  template: `
    <div class="mx-auto max-w-3xl p-8">
      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Basic</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <app-carousel class="mx-auto w-full max-w-xs">
            <app-carousel-content>
              <app-carousel-item>
                <div class="aspect-square rounded-md border p-6 flex items-center justify-center">
                  <span class="text-2xl font-semibold">1</span>
                </div>
              </app-carousel-item>
              <app-carousel-item>
                <div class="aspect-square rounded-md border p-6 flex items-center justify-center">
                  <span class="text-2xl font-semibold">2</span>
                </div>
              </app-carousel-item>
              <app-carousel-item>
                <div class="aspect-square rounded-md border p-6 flex items-center justify-center">
                  <span class="text-2xl font-semibold">3</span>
                </div>
              </app-carousel-item>
              <app-carousel-item>
                <div class="aspect-square rounded-md border p-6 flex items-center justify-center">
                  <span class="text-2xl font-semibold">4</span>
                </div>
              </app-carousel-item>
              <app-carousel-item>
                <div class="aspect-square rounded-md border p-6 flex items-center justify-center">
                  <span class="text-2xl font-semibold">5</span>
                </div>
              </app-carousel-item>
            </app-carousel-content>
            <app-carousel-previous />
            <app-carousel-next />
          </app-carousel>
        </div>
      </section>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Multiple</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <app-carousel class="mx-auto w-full max-w-sm" [opts]="{ align: 'start' }">
            <app-carousel-content>
              <app-carousel-item class="basis-1/3">
                <div class="aspect-square rounded-md border p-4 flex items-center justify-center">
                  <span class="text-lg font-semibold">1</span>
                </div>
              </app-carousel-item>
              <app-carousel-item class="basis-1/3">
                <div class="aspect-square rounded-md border p-4 flex items-center justify-center">
                  <span class="text-lg font-semibold">2</span>
                </div>
              </app-carousel-item>
              <app-carousel-item class="basis-1/3">
                <div class="aspect-square rounded-md border p-4 flex items-center justify-center">
                  <span class="text-lg font-semibold">3</span>
                </div>
              </app-carousel-item>
              <app-carousel-item class="basis-1/3">
                <div class="aspect-square rounded-md border p-4 flex items-center justify-center">
                  <span class="text-lg font-semibold">4</span>
                </div>
              </app-carousel-item>
              <app-carousel-item class="basis-1/3">
                <div class="aspect-square rounded-md border p-4 flex items-center justify-center">
                  <span class="text-lg font-semibold">5</span>
                </div>
              </app-carousel-item>
            </app-carousel-content>
            <app-carousel-previous />
            <app-carousel-next />
          </app-carousel>
        </div>
      </section>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Gap</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <app-carousel class="mx-auto w-full max-w-sm" [opts]="{ align: 'start' }">
            <app-carousel-content>
              <app-carousel-item class="basis-1/2">
                <div class="aspect-square rounded-md border p-4 flex items-center justify-center">
                  <span class="text-lg font-semibold">1</span>
                </div>
              </app-carousel-item>
              <app-carousel-item class="basis-1/2">
                <div class="aspect-square rounded-md border p-4 flex items-center justify-center">
                  <span class="text-lg font-semibold">2</span>
                </div>
              </app-carousel-item>
              <app-carousel-item class="basis-1/2">
                <div class="aspect-square rounded-md border p-4 flex items-center justify-center">
                  <span class="text-lg font-semibold">3</span>
                </div>
              </app-carousel-item>
            </app-carousel-content>
            <app-carousel-previous />
            <app-carousel-next />
          </app-carousel>
        </div>
      </section>
    </div>
  `,
})
export class CarouselPreviewComponent {}
