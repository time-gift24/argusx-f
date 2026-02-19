import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TabsComponents } from '@app/shared/ui/tabs';

@Component({
  selector: 'app-tabs-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TabsComponents],
  template: `
    <div class="mx-auto max-w-3xl p-8 space-y-8">
      <h1 class="mb-2 text-2xl font-semibold">Tabs</h1>
      <p class="mb-8 text-muted-foreground">
        Organize related content into layered sections and switch between them.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Default</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-4">
          <app-tabs [(value)]="mainTab" class="w-full">
            <app-tabs-list>
              <app-tabs-trigger value="account">Account</app-tabs-trigger>
              <app-tabs-trigger value="password">Password</app-tabs-trigger>
              <app-tabs-trigger value="team">Team</app-tabs-trigger>
            </app-tabs-list>

            <app-tabs-content value="account" class="rounded-md border p-4 text-xs">
              Manage your account profile, contact details, and language settings.
            </app-tabs-content>
            <app-tabs-content value="password" class="rounded-md border p-4 text-xs">
              Update password policy and configure 2FA preferences.
            </app-tabs-content>
            <app-tabs-content value="team" class="rounded-md border p-4 text-xs">
              Invite members and configure organization access roles.
            </app-tabs-content>
          </app-tabs>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Uncontrolled (defaultValue)</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-4">
          <app-tabs defaultValue="password" class="w-full">
            <app-tabs-list>
              <app-tabs-trigger value="account">Account</app-tabs-trigger>
              <app-tabs-trigger value="password">Password</app-tabs-trigger>
              <app-tabs-trigger value="team">Team</app-tabs-trigger>
            </app-tabs-list>

            <app-tabs-content value="account" class="rounded-md border p-4 text-xs">
              Manage your account profile, contact details, and language settings.
            </app-tabs-content>
            <app-tabs-content value="password" class="rounded-md border p-4 text-xs">
              Update password policy and configure 2FA preferences.
            </app-tabs-content>
            <app-tabs-content value="team" class="rounded-md border p-4 text-xs">
              Invite members and configure organization access roles.
            </app-tabs-content>
          </app-tabs>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Line Variant</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <app-tabs [(value)]="lineTab" class="w-full">
            <app-tabs-list variant="line">
              <app-tabs-trigger value="overview">Overview</app-tabs-trigger>
              <app-tabs-trigger value="activity">Activity</app-tabs-trigger>
              <app-tabs-trigger value="billing" [disabled]="true">Billing</app-tabs-trigger>
            </app-tabs-list>

            <app-tabs-content value="overview" class="pt-3 text-xs text-muted-foreground">
              Last 30 days performance summary and metrics.
            </app-tabs-content>
            <app-tabs-content value="activity" class="pt-3 text-xs text-muted-foreground">
              Audit log and recent updates from collaborators.
            </app-tabs-content>
            <app-tabs-content value="billing" class="pt-3 text-xs text-muted-foreground">
              Billing is disabled for this workspace.
            </app-tabs-content>
          </app-tabs>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Vertical Orientation</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <app-tabs [(value)]="verticalTab" orientation="vertical" class="w-full">
            <app-tabs-list>
              <app-tabs-trigger value="account">Account</app-tabs-trigger>
              <app-tabs-trigger value="password">Password</app-tabs-trigger>
              <app-tabs-trigger value="team">Team</app-tabs-trigger>
            </app-tabs-list>

            <app-tabs-content value="account" class="rounded-md border p-4 text-xs">
              Manage your account profile, contact details, and language settings.
            </app-tabs-content>
            <app-tabs-content value="password" class="rounded-md border p-4 text-xs">
              Update password policy and configure 2FA preferences.
            </app-tabs-content>
            <app-tabs-content value="team" class="rounded-md border p-4 text-xs">
              Invite members and configure organization access roles.
            </app-tabs-content>
          </app-tabs>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Disabled</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <app-tabs value="account" [disabled]="true" class="w-full">
            <app-tabs-list>
              <app-tabs-trigger value="account">Account</app-tabs-trigger>
              <app-tabs-trigger value="password">Password</app-tabs-trigger>
              <app-tabs-trigger value="team">Team</app-tabs-trigger>
            </app-tabs-list>

            <app-tabs-content value="account" class="rounded-md border p-4 text-xs">
              This entire tabs component is disabled.
            </app-tabs-content>
            <app-tabs-content value="password" class="rounded-md border p-4 text-xs">
              Update password policy and configure 2FA preferences.
            </app-tabs-content>
            <app-tabs-content value="team" class="rounded-md border p-4 text-xs">
              Invite members and configure organization access roles.
            </app-tabs-content>
          </app-tabs>
        </div>
      </section>
    </div>
  `,
})
export class TabsPreviewComponent {
  readonly mainTab = signal('account');
  readonly lineTab = signal('overview');
  readonly verticalTab = signal('account');
}
