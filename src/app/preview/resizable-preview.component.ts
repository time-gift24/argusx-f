import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ArgusxResizableComponents } from '@app/shared/ui/resizable';

@Component({
  selector: 'app-resizable-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArgusxResizableComponents],
  template: `
    <div class="mx-auto max-w-4xl p-8 space-y-8">
      <h1 class="mb-2 text-2xl font-semibold">Resizable</h1>
      <p class="mb-8 text-muted-foreground">
        Panels that can be resized by dragging handles between them.
      </p>

      <!-- Horizontal Panels (shadcn-aligned) -->
      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Horizontal Panels</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-4">
          <argusx-resizable-panel-group class="h-56 w-full rounded-md border" orientation="horizontal">
            <argusx-resizable-panel [defaultSize]="35" [minSize]="20">
              <div class="flex h-full items-center justify-center bg-muted/40 text-xs font-medium">
                Navigation
              </div>
            </argusx-resizable-panel>
            <argusx-resizable-handle [withHandle]="true" />
            <argusx-resizable-panel [defaultSize]="65" [minSize]="30">
              <div class="flex h-full items-center justify-center bg-background text-xs font-medium">
                Main Content
              </div>
            </argusx-resizable-panel>
          </argusx-resizable-panel-group>
        </div>
      </section>

      <!-- Vertical Panels (shadcn-aligned) -->
      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Vertical Panels</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-4">
          <argusx-resizable-panel-group class="h-64 w-full rounded-md border" orientation="vertical">
            <argusx-resizable-panel [defaultSize]="55" [minSize]="30">
              <div class="flex h-full items-center justify-center bg-muted/30 text-xs font-medium">
                Editor
              </div>
            </argusx-resizable-panel>
            <argusx-resizable-handle [withHandle]="true" />
            <argusx-resizable-panel [defaultSize]="45" [minSize]="20">
              <div class="flex h-full items-center justify-center bg-background text-xs font-medium">
                Console
              </div>
            </argusx-resizable-panel>
          </argusx-resizable-panel-group>
        </div>
      </section>

      <!-- ArgusX Extension: Disabled Handle -->
      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Disabled Handle (ArgusX Extension)</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-4">
          <argusx-resizable-panel-group class="h-56 w-full rounded-md border" orientation="horizontal">
            <argusx-resizable-panel [defaultSize]="50">
              <div class="flex h-full items-center justify-center bg-muted/40 text-xs font-medium">
                Panel 1
              </div>
            </argusx-resizable-panel>
            <argusx-resizable-handle [disabled]="true" />
            <argusx-resizable-panel [defaultSize]="50">
              <div class="flex h-full items-center justify-center bg-background text-xs font-medium">
                Panel 2 (Cannot resize)
              </div>
            </argusx-resizable-panel>
          </argusx-resizable-panel-group>
        </div>
      </section>

      <!-- ArgusX Extension: Auto Save -->
      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Auto Save (ArgusX Extension)</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-4">
          <argusx-resizable-panel-group class="h-56 w-full rounded-md border" orientation="horizontal" autoSaveId="demo-panels">
            <argusx-resizable-panel [defaultSize]="30" [minSize]="15">
              <div class="flex h-full items-center justify-center bg-muted/40 text-xs font-medium">
                Left (Sizes saved!)
              </div>
            </argusx-resizable-panel>
            <argusx-resizable-handle [withHandle]="true" />
            <argusx-resizable-panel [defaultSize]="70" [minSize]="15">
              <div class="flex h-full items-center justify-center bg-background text-xs font-medium">
                Right (Refresh to test)
              </div>
            </argusx-resizable-panel>
          </argusx-resizable-panel-group>
        </div>
      </section>
    </div>
  `,
})
export class ResizablePreviewComponent {}
