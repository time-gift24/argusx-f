import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonDirective } from '@app/shared/ui/button';
import { ToastComponents, ToastService, type ToastPosition } from '@app/shared/ui/toast';

@Component({
  selector: 'app-toast-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonDirective, ToastComponents],
  template: `
    <div class="mx-auto max-w-3xl p-8 space-y-8">
      <h1 class="mb-2 text-2xl font-semibold">Toast</h1>
      <p class="mb-8 text-muted-foreground">
        Lightweight notifications for success, error, and loading feedback.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Variants</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 flex flex-wrap gap-2">
          <button argusButton size="sm" (click)="showSuccess()">Success</button>
          <button argusButton size="sm" variant="destructive" (click)="showError()">Error</button>
          <button argusButton size="sm" variant="outline" (click)="showWarning()">Warning</button>
          <button argusButton size="sm" variant="secondary" (click)="showInfo()">Info</button>
          <button argusButton size="sm" variant="ghost" (click)="showLoading()">Loading</button>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Position</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 flex flex-wrap gap-2">
          @for (position of positions; track position) {
            <button argusButton size="sm" variant="outline" (click)="setPosition(position)">
              {{ position }}
            </button>
          }
        </div>
      </section>

      <app-toaster />
    </div>
  `,
})
export class ToastPreviewComponent {
  private readonly toast = inject(ToastService);

  readonly positions: ToastPosition[] = [
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
  ];

  showSuccess(): void {
    this.toast.success('Saved', 'Your profile has been updated.');
  }

  showError(): void {
    this.toast.error('Failed', 'Could not connect to the server.');
  }

  showWarning(): void {
    this.toast.warning('Heads up', 'Your API key will expire in 3 days.');
  }

  showInfo(): void {
    this.toast.info('Sync started', 'Importing 248 records in background.');
  }

  showLoading(): void {
    const loadingId = this.toast.loading('Publishing', 'Please wait...', { duration: 0 });
    setTimeout(() => {
      this.toast.dismiss(loadingId);
      this.toast.success('Published', 'Release notes are now live.');
    }, 1400);
  }

  setPosition(position: ToastPosition): void {
    this.toast.setPosition(position);
    this.toast.info('Position updated', position, { duration: 1600 });
  }
}
