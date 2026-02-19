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
import { BadgeDirective } from '../shared/ui/badge';

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
    BadgeDirective,
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
            <app-alert>
              <app-alert-title>Success! Your changes have been saved.</app-alert-title>
            </app-alert>

            <app-alert>
              <app-alert-title>Success! Your changes have been saved.</app-alert-title>
              <app-alert-description>
                This is an alert with title and description.
              </app-alert-description>
            </app-alert>

            <app-alert>
              <app-alert-description>
                This one has a description only. No title. No icon.
              </app-alert-description>
            </app-alert>
          </div>
        </div>
      </section>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Icons</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="grid w-full max-w-xl items-start gap-4">
            <app-alert>
              <lucide-icon [img]="alertCircleIcon" />
              <app-alert-title>
                Let's try one with icon, title and a
                <a href="#" (click)="$event.preventDefault()">link</a>.
              </app-alert-title>
            </app-alert>

            <app-alert>
              <lucide-icon [img]="alertCircleIcon" />
              <app-alert-description>
                <p>
                  This one has an icon and a description only. No title.
                  <a href="#" (click)="$event.preventDefault()">But it has a link</a>
                  and a
                  <a href="#" (click)="$event.preventDefault()">second link</a>.
                </p>
              </app-alert-description>
            </app-alert>

            <app-alert>
              <lucide-icon [img]="alertCircleIcon" />
              <app-alert-title>Success! Your changes have been saved</app-alert-title>
              <app-alert-description>
                This is an alert with icon, title and description.
              </app-alert-description>
            </app-alert>

            <app-alert>
              <lucide-icon [img]="alertCircleIcon" />
              <app-alert-title>
                This is a very long alert title that demonstrates how the component handles extended
                text content and potentially wraps across multiple lines
              </app-alert-title>
            </app-alert>

            <app-alert>
              <lucide-icon [img]="alertCircleIcon" />
              <app-alert-description>
                This is a very long alert description that demonstrates how the component handles
                extended text content and potentially wraps across multiple lines
              </app-alert-description>
            </app-alert>

            <app-alert>
              <lucide-icon [img]="alertCircleIcon" />
              <app-alert-title>
                This is an extremely long alert title that spans multiple lines to demonstrate how
                the component handles very lengthy headings while maintaining readability and proper
                text wrapping behavior
              </app-alert-title>
              <app-alert-description>
                This is an equally long description that contains detailed information about the
                alert. It shows how the component can accommodate extensive content while preserving
                proper spacing, alignment, and readability across different screen sizes and viewport
                widths. This helps ensure the user experience remains consistent regardless of the
                content length.
              </app-alert-description>
            </app-alert>
          </div>
        </div>
      </section>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Destructive</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="grid w-full max-w-xl items-start gap-4">
            <app-alert variant="destructive">
              <lucide-icon [img]="alertCircleIcon" />
              <app-alert-title>Something went wrong!</app-alert-title>
              <app-alert-description>
                Your session has expired. Please log in again.
              </app-alert-description>
            </app-alert>

            <app-alert variant="destructive">
              <lucide-icon [img]="alertCircleIcon" />
              <app-alert-title>Unable to process your payment.</app-alert-title>
              <app-alert-description>
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
              </app-alert-description>
            </app-alert>
          </div>
        </div>
      </section>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Actions</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="grid w-full max-w-xl items-start gap-4">
            <app-alert>
              <app-alert-title>The selected emails have been marked as spam.</app-alert-title>
              <app-alert-action>
                <button argusx-button variant="outline" size="sm">Undo</button>
              </app-alert-action>
            </app-alert>

            <app-alert>
              <app-alert-title>The selected emails have been marked as spam.</app-alert-title>
              <app-alert-description>
                This is a very long alert title that demonstrates how the component handles extended
                text content.
              </app-alert-description>
              <app-alert-action>
                <span appBadge variant="secondary">Badge</span>
              </app-alert-action>
            </app-alert>
          </div>
        </div>
      </section>

      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Local Variants (Extended)</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="grid w-full max-w-xl items-start gap-4">
            <app-alert variant="info" class="border-info/30 bg-info/20">
              <lucide-icon [img]="infoIcon" class="text-blue-600" />
              <app-alert-title class="text-blue-700">Informational update</app-alert-title>
              <app-alert-description class="text-blue-700/80">
                Local implementation supports additional semantic variants.
              </app-alert-description>
            </app-alert>

            <app-alert variant="warning" class="border-warning/30 bg-warning/20">
              <lucide-icon [img]="alertTriangleIcon" class="text-amber-600" />
              <app-alert-title class="text-amber-700">Warning: review required</app-alert-title>
              <app-alert-description class="text-amber-700/80">
                Please verify these changes before continuing.
              </app-alert-description>
            </app-alert>

            <app-alert variant="success" class="border-success/30 bg-success/20">
              <lucide-icon [img]="checkCircleIcon" class="text-emerald-600" />
              <app-alert-title class="text-emerald-700">Operation completed successfully</app-alert-title>
              <app-alert-description class="text-emerald-700/80">
                This variant is available in the local implementation.
              </app-alert-description>
            </app-alert>
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
