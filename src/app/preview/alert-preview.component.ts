import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  AlertComponent,
  AlertActionComponent,
  AlertDescriptionComponent,
  AlertTitleComponent,
} from '../shared/ui/alert/index';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  LucideAngularModule,
} from 'lucide-angular';
import { ArgusxButtonDirective } from '../shared/ui/button';
import { ArgusxBadgeDirective } from '../shared/ui/badge';

@Component({
  selector: 'app-alert-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    AlertActionComponent,
    AlertTitleComponent,
    AlertDescriptionComponent,
    LucideAngularModule,
    ArgusxButtonDirective,
    ArgusxBadgeDirective,
  ],
  template: `
    <div class="mx-auto max-w-6xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Alert</h1>
      <p class="mb-8 text-muted-foreground">
        Display a callout for user attention.
      </p>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Basic</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="grid w-full max-w-xl items-start gap-4">
            <argusx-alert>
              <argusx-alert-title>Success! Your changes have been saved.</argusx-alert-title>
            </argusx-alert>

            <argusx-alert>
              <argusx-alert-title>Success! Your changes have been saved.</argusx-alert-title>
              <argusx-alert-description>
                This is an alert with title and description.
              </argusx-alert-description>
            </argusx-alert>

            <argusx-alert>
              <argusx-alert-description>
                This one has a description only. No title. No icon.
              </argusx-alert-description>
            </argusx-alert>
          </div>
        </div>
      </section>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Icons</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="grid w-full max-w-xl items-start gap-4">
            <argusx-alert>
              <lucide-icon [img]="alertCircleIcon" />
              <argusx-alert-title>
                Let's try one with icon, title and a
                <a href="#" (click)="$event.preventDefault()">link</a>.
              </argusx-alert-title>
            </argusx-alert>

            <argusx-alert>
              <lucide-icon [img]="alertCircleIcon" />
              <argusx-alert-description>
                <p>
                  This one has an icon and a description only. No title.
                  <a href="#" (click)="$event.preventDefault()">But it has a link</a>
                  and a
                  <a href="#" (click)="$event.preventDefault()">second link</a>.
                </p>
              </argusx-alert-description>
            </argusx-alert>

            <argusx-alert>
              <lucide-icon [img]="alertCircleIcon" />
              <argusx-alert-title>Success! Your changes have been saved</argusx-alert-title>
              <argusx-alert-description>
                This is an alert with icon, title and description.
              </argusx-alert-description>
            </argusx-alert>

            <argusx-alert>
              <lucide-icon [img]="alertCircleIcon" />
              <argusx-alert-title>
                This is a very long alert title that demonstrates how the component handles extended
                text content and potentially wraps across multiple lines
              </argusx-alert-title>
            </argusx-alert>

            <argusx-alert>
              <lucide-icon [img]="alertCircleIcon" />
              <argusx-alert-description>
                This is a very long alert description that demonstrates how the component handles
                extended text content and potentially wraps across multiple lines
              </argusx-alert-description>
            </argusx-alert>

            <argusx-alert>
              <lucide-icon [img]="alertCircleIcon" />
              <argusx-alert-title>
                This is an extremely long alert title that spans multiple lines to demonstrate how
                the component handles very lengthy headings while maintaining readability and proper
                text wrapping behavior
              </argusx-alert-title>
              <argusx-alert-description>
                This is an equally long description that contains detailed information about the
                alert. It shows how the component can accommodate extensive content while preserving
                proper spacing, alignment, and readability across different screen sizes and viewport
                widths. This helps ensure the user experience remains consistent regardless of the
                content length.
              </argusx-alert-description>
            </argusx-alert>
          </div>
        </div>
      </section>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Destructive</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="grid w-full max-w-xl items-start gap-4">
            <argusx-alert variant="destructive">
              <lucide-icon [img]="alertCircleIcon" />
              <argusx-alert-title>Something went wrong!</argusx-alert-title>
              <argusx-alert-description>
                Your session has expired. Please log in again.
              </argusx-alert-description>
            </argusx-alert>

            <argusx-alert variant="destructive">
              <lucide-icon [img]="alertCircleIcon" />
              <argusx-alert-title>Unable to process your payment.</argusx-alert-title>
              <argusx-alert-description>
                <p>
                  Please verify your
                  <a href="#" (click)="$event.preventDefault()">billing information</a>
                  and try again.
                </p>
                <ul class="list-inside list-disc text-sm">
                  <li>Check your card details</li>
                  <li>Ensure sufficient funds</li>
                  <li>Verify billing address</li>
                </ul>
              </argusx-alert-description>
            </argusx-alert>
          </div>
        </div>
      </section>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Actions</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="grid w-full max-w-xl items-start gap-4">
            <argusx-alert>
              <argusx-alert-title>The selected emails have been marked as spam.</argusx-alert-title>
              <argusx-alert-action>
                <button argusx-button variant="outline" size="sm">Undo</button>
              </argusx-alert-action>
            </argusx-alert>

            <argusx-alert>
              <argusx-alert-title>The selected emails have been marked as spam.</argusx-alert-title>
              <argusx-alert-description>
                This is a very long alert title that demonstrates how the component handles extended
                text content.
              </argusx-alert-description>
              <argusx-alert-action>
                <span argusx-badge variant="secondary">Badge</span>
              </argusx-alert-action>
            </argusx-alert>
          </div>
        </div>
      </section>

      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Local Variants (Extended)</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="grid w-full max-w-xl items-start gap-4">
            <argusx-alert variant="info" class="border-info/30 bg-info/20">
              <lucide-icon [img]="infoIcon" class="text-blue-600" />
              <argusx-alert-title class="text-blue-700">Informational update</argusx-alert-title>
              <argusx-alert-description class="text-blue-700/80">
                Local implementation supports additional semantic variants.
              </argusx-alert-description>
            </argusx-alert>

            <argusx-alert variant="warning" class="border-warning/30 bg-warning/20">
              <lucide-icon [img]="alertTriangleIcon" class="text-amber-600" />
              <argusx-alert-title class="text-amber-700">Warning: review required</argusx-alert-title>
              <argusx-alert-description class="text-amber-700/80">
                Please verify these changes before continuing.
              </argusx-alert-description>
            </argusx-alert>

            <argusx-alert variant="success" class="border-success/30 bg-success/20">
              <lucide-icon [img]="checkCircleIcon" class="text-emerald-600" />
              <argusx-alert-title class="text-emerald-700">Operation completed successfully</argusx-alert-title>
              <argusx-alert-description class="text-emerald-700/80">
                This variant is available in the local implementation.
              </argusx-alert-description>
            </argusx-alert>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class AlertPreviewComponent {
  readonly alertCircleIcon = AlertCircle;
  readonly infoIcon = Info;
  readonly alertTriangleIcon = AlertTriangle;
  readonly checkCircleIcon = CheckCircle;
}
