import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ArgusxSpinnerComponent } from '@app/shared/ui/spinner';

@Component({
  selector: 'app-spinner-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArgusxSpinnerComponent],
  template: `
    <div class="mx-auto max-w-3xl p-8 space-y-8">
      <h1 class="mb-2 text-2xl font-semibold">Spinner</h1>
      <p class="mb-8 text-muted-foreground">
        Animated loading indicator for asynchronous states.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Sizes</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="flex items-center gap-5">
            <argusx-spinner class="size-3" />
            <argusx-spinner class="size-5" />
            <argusx-spinner class="size-7" />
            <argusx-spinner class="size-10 text-primary" />
          </div>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Inline Loading</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs">
            <argusx-spinner class="size-4" />
            <span>Syncing latest changes...</span>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class SpinnerPreviewComponent {}
