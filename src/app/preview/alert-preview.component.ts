import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  AlertActionComponent,
  AlertComponent,
  AlertDescriptionComponent,
  AlertTitleComponent,
} from '../shared/ui/alert/index';
import {
  AlertCircle,
  CheckCircle,
  Info,
  LucideAngularModule,
  TriangleAlert,
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
        Shadcn-aligned alert primitives with ArgusX plain extensions.
      </p>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Shadcn Baseline</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="grid w-full max-w-xl items-start gap-4">
            <argusx-alert>
              <lucide-icon [img]="checkCircleIcon" />
              <argusx-alert-title>Success! Your changes have been saved.</argusx-alert-title>
              <argusx-alert-description>
                This is an alert with icon, title, and description.
              </argusx-alert-description>
            </argusx-alert>

            <argusx-alert>
              <lucide-icon [img]="checkCircleIcon" />
              <argusx-alert-title>
                This alert has a title and an icon. No description.
              </argusx-alert-title>
            </argusx-alert>

            <argusx-alert variant="destructive">
              <lucide-icon [img]="alertCircleIcon" />
              <argusx-alert-title>Unable to process your payment.</argusx-alert-title>
              <argusx-alert-description>
                <p>Please verify your billing information and try again.</p>
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
          <h2 class="text-sm font-medium text-muted-foreground">ArgusX Plain Extensions</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="grid w-full max-w-xl items-start gap-4">
            <argusx-alert variant="info">
              <lucide-icon [img]="infoIcon" />
              <argusx-alert-title>Service update</argusx-alert-title>
              <argusx-alert-description>
                Maintenance will start at 03:00 UTC and is expected to last 20 minutes.
              </argusx-alert-description>
            </argusx-alert>

            <argusx-alert variant="warning">
              <lucide-icon [img]="alertTriangleIcon" />
              <argusx-alert-title>Configuration drift detected</argusx-alert-title>
              <argusx-alert-description>
                Review the pending environment changes before applying the next migration.
              </argusx-alert-description>
            </argusx-alert>

            <argusx-alert variant="success">
              <lucide-icon [img]="checkCircleIcon" />
              <argusx-alert-title>Deployment completed</argusx-alert-title>
              <argusx-alert-description>
                The release is live in all regions with no health check regressions.
              </argusx-alert-description>
            </argusx-alert>

            <argusx-alert variant="plain">
              <argusx-alert-title>Action slot on plain baseline</argusx-alert-title>
              <argusx-alert-description>
                This combines plain default styling with ArgusX action-slot extension.
              </argusx-alert-description>
              <argusx-alert-action>
                <button argusx-button variant="outline" size="sm">Review</button>
                <button argusx-button variant="ghost" size="sm">Ignore</button>
              </argusx-alert-action>
            </argusx-alert>
          </div>
        </div>
      </section>

      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Complex Combination</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="grid w-full max-w-xl items-start gap-4">
            <argusx-alert variant="warning">
              <lucide-icon [img]="alertTriangleIcon" />
              <argusx-alert-title>Manual review required before deployment</argusx-alert-title>
              <argusx-alert-description>
                <p>
                  The canary check reported increased p95 latency in one region. Validate rollout
                  gates before continuing.
                </p>
                <ul class="list-inside list-disc text-sm">
                  <li>Inspect the region-specific metrics dashboard</li>
                  <li>Confirm retry budget remains within threshold</li>
                  <li>Decide whether to continue or rollback</li>
                </ul>
              </argusx-alert-description>
              <argusx-alert-action>
                <span argusx-badge variant="secondary">Needs approval</span>
                <button argusx-button variant="outline" size="sm">Open checklist</button>
                <button argusx-button variant="ghost" size="sm">Dismiss</button>
              </argusx-alert-action>
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
  readonly alertTriangleIcon = TriangleAlert;
  readonly checkCircleIcon = CheckCircle;
}
