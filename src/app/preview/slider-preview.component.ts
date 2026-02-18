import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SliderComponent } from '../shared/ui/slider';

@Component({
  selector: 'app-slider-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SliderComponent],
  template: `
    <div class="mx-auto max-w-6xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Slider</h1>
      <p class="mb-8 text-muted-foreground">
        A control that allows the user to select a single value from a range.
      </p>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <!-- Basic Usage -->
        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">Basic Usage</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <div class="space-y-4">
              <app-slider [value]="basicValue()" (valueChange)="basicValue.set($event)" />
              <p class="text-sm text-muted-foreground">Value: {{ basicValue() }}</p>
            </div>
          </div>
        </section>

        <!-- With Min/Max -->
        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">Custom Range (0-1000)</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <div class="space-y-4">
              <app-slider
                [min]="0"
                [max]="1000"
                [value]="rangeValue()"
                (valueChange)="rangeValue.set($event)"
              />
              <p class="text-sm text-muted-foreground">Value: {{ rangeValue() }}</p>
            </div>
          </div>
        </section>

        <!-- Different Step -->
        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">Step (0.5)</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <div class="space-y-4">
              <app-slider
                [min]="0"
                [max]="10"
                [step]="0.5"
                [value]="stepValue()"
                (valueChange)="stepValue.set($event)"
              />
              <p class="text-sm text-muted-foreground">Value: {{ stepValue() }}</p>
            </div>
          </div>
        </section>

        <!-- Step 10 -->
        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">Step (10)</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <div class="space-y-4">
              <app-slider
                [min]="0"
                [max]="100"
                [step]="10"
                [value]="step10Value()"
                (valueChange)="step10Value.set($event)"
              />
              <p class="text-sm text-muted-foreground">Value: {{ step10Value() }}</p>
            </div>
          </div>
        </section>

        <!-- Disabled State -->
        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">Disabled</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <div class="space-y-4">
              <app-slider [value]="0" [disabled]="true" />
              <p class="text-sm text-muted-foreground">Disabled with value 0</p>
            </div>
            <div class="mt-4 space-y-4">
              <app-slider [value]="50" [disabled]="true" />
              <p class="text-sm text-muted-foreground">Disabled with value 50</p>
            </div>
            <div class="mt-4 space-y-4">
              <app-slider [value]="100" [disabled]="true" />
              <p class="text-sm text-muted-foreground">Disabled with value 100</p>
            </div>
          </div>
        </section>

        <!-- Vertical Orientation -->
        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">Vertical</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <div class="flex h-48 items-center justify-center gap-8">
              <app-slider
                [min]="0"
                [max]="100"
                [value]="verticalValue()"
                [orientation]="'vertical'"
                (valueChange)="verticalValue.set($event)"
              />
              <div class="flex h-48 items-center">
                <app-slider
                  [min]="0"
                  [max]="100"
                  [value]="50"
                  [orientation]="'vertical'"
                  [disabled]="true"
                />
              </div>
              <div class="text-sm text-muted-foreground">
                <p>Value: {{ verticalValue() }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- With Label -->
        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">With Label</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <div class="space-y-4">
              <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for="volume-slider">
                Volume
              </label>
              <app-slider
                id="volume-slider"
                [min]="0"
                [max]="100"
                [value]="volumeValue()"
                (valueChange)="volumeValue.set($event)"
              />
              <p class="text-sm text-muted-foreground">Adjust the volume level</p>
            </div>
          </div>
        </section>

        <!-- With Name -->
        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">With Name</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <div class="space-y-4">
              <app-slider
                [min]="0"
                [max]="100"
                [value]="nameValue()"
                name="priceRange"
                (valueChange)="nameValue.set($event)"
              />
              <p class="text-sm text-muted-foreground">Value: {{ nameValue() }}</p>
              <p class="text-xs text-muted-foreground">Hidden input name: priceRange</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class SliderPreviewComponent {
  readonly basicValue = signal(50);
  readonly rangeValue = signal(500);
  readonly stepValue = signal(5);
  readonly step10Value = signal(50);
  readonly verticalValue = signal(50);
  readonly volumeValue = signal(75);
  readonly nameValue = signal(25);
}
