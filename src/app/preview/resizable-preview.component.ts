import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ResizableComponents } from '@app/shared/ui/resizable';

@Component({
  selector: 'app-resizable-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ResizableComponents],
  template: `
    <div class="mx-auto max-w-4xl p-8 space-y-8">
      <h1 class="mb-2 text-2xl font-semibold">Resizable</h1>
      <p class="mb-8 text-muted-foreground">
        Panels that can be resized by dragging handles between them.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Horizontal Panels</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-4">
          <app-resizable-panel-group class="h-56 w-full rounded-md border" orientation="horizontal">
            <app-resizable-panel [defaultSize]="35" [minSize]="20">
              <div class="flex h-full items-center justify-center bg-muted/40 text-xs font-medium">
                Navigation
              </div>
            </app-resizable-panel>
            <app-resizable-handle [withHandle]="true" />
            <app-resizable-panel [defaultSize]="65" [minSize]="30">
              <div class="flex h-full items-center justify-center bg-background text-xs font-medium">
                Main Content
              </div>
            </app-resizable-panel>
          </app-resizable-panel-group>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Vertical Panels</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-4">
          <app-resizable-panel-group class="h-64 w-full rounded-md border" orientation="vertical">
            <app-resizable-panel [defaultSize]="55" [minSize]="30">
              <div class="flex h-full items-center justify-center bg-muted/30 text-xs font-medium">
                Editor
              </div>
            </app-resizable-panel>
            <app-resizable-handle [withHandle]="true" />
            <app-resizable-panel [defaultSize]="45" [minSize]="20">
              <div class="flex h-full items-center justify-center bg-background text-xs font-medium">
                Console
              </div>
            </app-resizable-panel>
          </app-resizable-panel-group>
        </div>
      </section>
    </div>
  `,
})
export class ResizablePreviewComponent {}
