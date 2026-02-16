import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AvatarComponent, AvatarImageDirective, AvatarFallbackDirective, AvatarBadgeComponent, AvatarGroupComponent, AvatarGroupCountComponent } from '../../../src/app/shared/ui/avatar';

@Component({
  selector: 'app-avatar-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AvatarComponent,
    AvatarImageDirective,
    AvatarFallbackDirective,
    AvatarBadgeComponent,
    AvatarGroupComponent,
    AvatarGroupCountComponent,
  ],
  template: `
    <div class="mx-auto max-w-6xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Avatar</h1>
      <p class="mb-8 text-muted-foreground">
        Displays an image or entity that represents a user.
      </p>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <!-- Basic Usage -->
        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">Basic Usage</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <div class="flex flex-wrap items-center gap-4">
              <app-avatar>
                <img appAvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <span appAvatarFallback>CN</span>
              </app-avatar>
              <app-avatar>
                <img appAvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
                <span appAvatarFallback>ER</span>
              </app-avatar>
            </div>
          </div>
        </section>

        <!-- Sizes -->
        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">Sizes</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <div class="flex flex-wrap items-center gap-4">
              <app-avatar size="sm">
                <img appAvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <span appAvatarFallback>CN</span>
              </app-avatar>
              <app-avatar size="default">
                <img appAvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <span appAvatarFallback>CN</span>
              </app-avatar>
              <app-avatar size="lg">
                <img appAvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <span appAvatarFallback>CN</span>
              </app-avatar>
            </div>
          </div>
        </section>

        <!-- With Badge -->
        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">With Badge</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <div class="flex flex-wrap items-center gap-4">
              <app-avatar>
                <img appAvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <span appAvatarFallback>CN</span>
                <app-avatar-badge>
                  <div class="size-2.5 rounded-full bg-green-500"></div>
                </app-avatar-badge>
              </app-avatar>
              <app-avatar size="lg">
                <img appAvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <span appAvatarFallback>CN</span>
                <app-avatar-badge>
                  <div class="size-3 rounded-full bg-red-500"></div>
                </app-avatar-badge>
              </app-avatar>
            </div>
          </div>
        </section>

        <!-- Avatar Group -->
        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">Avatar Group</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <app-avatar-group>
              <app-avatar>
                <img appAvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <span appAvatarFallback>CN</span>
              </app-avatar>
              <app-avatar>
                <img appAvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
                <span appAvatarFallback>LR</span>
              </app-avatar>
              <app-avatar>
                <img appAvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
                <span appAvatarFallback>ER</span>
              </app-avatar>
              <app-avatar-group-count>+5</app-avatar-group-count>
            </app-avatar-group>
          </div>
        </section>

        <!-- Avatar Group with Badge -->
        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">Avatar Group with Badges</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <app-avatar-group>
              <app-avatar>
                <img appAvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <span appAvatarFallback>CN</span>
                <app-avatar-badge>
                  <div class="size-2.5 rounded-full bg-green-500"></div>
                </app-avatar-badge>
              </app-avatar>
              <app-avatar>
                <img appAvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
                <span appAvatarFallback>LR</span>
              </app-avatar>
              <app-avatar-group-count>+3</app-avatar-group-count>
            </app-avatar-group>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class AvatarPreviewComponent {}
