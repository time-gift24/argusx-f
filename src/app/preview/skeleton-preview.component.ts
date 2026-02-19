import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ArgusxSkeletonComponent } from '@app/shared/ui/skeleton';

@Component({
  selector: 'app-skeleton-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArgusxSkeletonComponent],
  template: `
    <div class="mx-auto max-w-3xl p-8 space-y-8">
      <h1 class="mb-2 text-2xl font-semibold">Skeleton</h1>
      <p class="mb-8 text-muted-foreground">
        Placeholder blocks used while content is loading.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Profile Card</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-4">
          <div class="flex items-center gap-3">
            <argusx-skeleton class="size-10 rounded-full"></argusx-skeleton>
            <div class="space-y-2">
              <argusx-skeleton class="h-3 w-32"></argusx-skeleton>
              <argusx-skeleton class="h-3 w-24"></argusx-skeleton>
            </div>
          </div>
          <argusx-skeleton class="h-20 w-full"></argusx-skeleton>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">List Loading</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-3">
          @for (row of [1, 2, 3, 4]; track row) {
            <div class="flex items-center gap-3">
              <argusx-skeleton class="size-8 rounded-full"></argusx-skeleton>
              <argusx-skeleton class="h-3 flex-1"></argusx-skeleton>
            </div>
          }
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Text Lines</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-2">
          <argusx-skeleton class="h-4 w-full"></argusx-skeleton>
          <argusx-skeleton class="h-4 w-[90%]"></argusx-skeleton>
          <argusx-skeleton class="h-4 w-[80%]"></argusx-skeleton>
          <argusx-skeleton class="h-4 w-[85%]"></argusx-skeleton>
        </div>
      </section>
    </div>
  `,
})
export class SkeletonPreviewComponent {}
