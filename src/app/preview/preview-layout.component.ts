import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-preview-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-screen w-screen overflow-hidden">
      <!-- Navbar -->
      <nav class="w-56 shrink-0 border-r border-border bg-sidebar px-3 py-3">
        <div class="mb-3">
          <h2 class="text-sm font-semibold text-sidebar-foreground">
            shadcn-angular
          </h2>
          <p class="text-[10px] uppercase tracking-wide text-muted-foreground/90">
            Components
          </p>
        </div>
        <ul class="space-y-0.5">
          <li>
            <button
              (click)="setPreview('button')"
              class="w-full text-left block rounded-md px-2.5 py-1.5 text-xs transition-colors {{
                currentPreview() === 'button'
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }}"
            >
              Button
            </button>
          </li>
          <li>
            <button
              (click)="setPreview('input')"
              class="w-full text-left block rounded-md px-2.5 py-1.5 text-xs transition-colors {{
                currentPreview() === 'input'
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }}"
            >
              Input
            </button>
          </li>
          <li>
            <button
              (click)="setPreview('card')"
              class="w-full text-left block rounded-md px-2.5 py-1.5 text-xs transition-colors {{
                currentPreview() === 'card'
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }}"
            >
              Card
            </button>
          </li>
        </ul>
      </nav>

      <!-- Iframe Container -->
      <main class="flex-1 overflow-hidden bg-background p-4">
        <iframe
          [src]="safeUrl()"
          class="h-full w-full overflow-auto rounded-lg border border-border bg-card"
        ></iframe>
      </main>
    </div>
  `,
})
export class PreviewLayoutComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly currentPreview = signal<'button' | 'input' | 'card'>('button');

  readonly safeUrl = (): SafeResourceUrl => {
    const url = `/preview/${this.currentPreview()}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  };

  setPreview(component: 'button' | 'input' | 'card'): void {
    this.currentPreview.set(component);
  }
}
