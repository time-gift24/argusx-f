import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ArgusxAvatarComponent, ArgusxAvatarImageDirective, ArgusxAvatarFallbackDirective, ArgusxAvatarBadgeComponent, ArgusxAvatarGroupComponent, ArgusxAvatarGroupCountComponent } from '../shared/ui/avatar';

@Component({
  selector: 'app-avatar-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ArgusxAvatarComponent,
    ArgusxAvatarImageDirective,
    ArgusxAvatarFallbackDirective,
    ArgusxAvatarBadgeComponent,
    ArgusxAvatarGroupComponent,
    ArgusxAvatarGroupCountComponent,
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
              <argusx-avatar>
                <img argusxAvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <span argusxAvatarFallback>CN</span>
              </argusx-avatar>
              <argusx-avatar>
                <img argusxAvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
                <span argusxAvatarFallback>ER</span>
              </argusx-avatar>
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
              <argusx-avatar size="sm">
                <img argusxAvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <span argusxAvatarFallback>CN</span>
              </argusx-avatar>
              <argusx-avatar size="default">
                <img argusxAvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <span argusxAvatarFallback>CN</span>
              </argusx-avatar>
              <argusx-avatar size="lg">
                <img argusxAvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <span argusxAvatarFallback>CN</span>
              </argusx-avatar>
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
              <argusx-avatar>
                <img argusxAvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <span argusxAvatarFallback>CN</span>
                <argusx-avatar-badge>
                  <div class="size-2.5 rounded-full bg-green-500"></div>
                </argusx-avatar-badge>
              </argusx-avatar>
              <argusx-avatar size="lg">
                <img argusxAvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <span argusxAvatarFallback>CN</span>
                <argusx-avatar-badge>
                  <div class="size-3 rounded-full bg-red-500"></div>
                </argusx-avatar-badge>
              </argusx-avatar>
            </div>
          </div>
        </section>

        <!-- Avatar Group -->
        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">Avatar Group</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <argusx-avatar-group>
              <argusx-avatar>
                <img argusxAvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <span argusxAvatarFallback>CN</span>
              </argusx-avatar>
              <argusx-avatar>
                <img argusxAvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
                <span argusxAvatarFallback>LR</span>
              </argusx-avatar>
              <argusx-avatar>
                <img argusxAvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
                <span argusxAvatarFallback>ER</span>
              </argusx-avatar>
              <argusx-avatar-group-count>+5</argusx-avatar-group-count>
            </argusx-avatar-group>
          </div>
        </section>

        <!-- Avatar Group with Badge -->
        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">Avatar Group with Badges</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <argusx-avatar-group>
              <argusx-avatar>
                <img argusxAvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <span argusxAvatarFallback>CN</span>
                <argusx-avatar-badge>
                  <div class="size-2.5 rounded-full bg-green-500"></div>
                </argusx-avatar-badge>
              </argusx-avatar>
              <argusx-avatar>
                <img argusxAvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
                <span argusxAvatarFallback>LR</span>
              </argusx-avatar>
              <argusx-avatar-group-count>+3</argusx-avatar-group-count>
            </argusx-avatar-group>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class AvatarPreviewComponent {}
