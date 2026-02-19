import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ArgusxBadgeDirective } from '@app/shared/ui/badge';
import {
  BadgeCheck,
  CircleDot,
  LucideAngularModule,
  Shield,
  Star,
  Zap,
} from 'lucide-angular';

@Component({
  selector: 'app-badge-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArgusxBadgeDirective, LucideAngularModule],
  template: `
    <div class="mx-auto max-w-3xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Badge</h1>
      <p class="mb-8 text-muted-foreground">
        Displays a badge or a component that looks like a badge.
      </p>

      <!-- Core Variants (shadcn-aligned) -->
      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Core Variants</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="flex flex-wrap gap-2">
            <span argusx-badge>Default</span>
            <span argusx-badge variant="secondary">Secondary</span>
            <span argusx-badge variant="destructive">Destructive</span>
            <span argusx-badge variant="outline">Outline</span>
          </div>
        </div>
      </section>

      <!-- Ghost Variant -->
      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Ghost</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="flex flex-wrap gap-2">
            <span argusx-badge variant="ghost">Ghost</span>
            <a argusx-badge variant="ghost" href="#" (click)="$event.preventDefault()">Ghost Link (hoverable)</a>
          </div>
        </div>
      </section>

      <!-- Link Variant -->
      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Link</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="flex flex-wrap gap-2">
            <a argusx-badge variant="link" href="#" (click)="$event.preventDefault()">Link Badge</a>
            <a argusx-badge variant="link" href="#" (click)="$event.preventDefault()">Another Link</a>
          </div>
        </div>
      </section>

      <!-- With Icons (shadcn demo parity) -->
      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Icons</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="flex flex-wrap gap-2">
            <span argusx-badge variant="secondary" class="bg-blue-500 text-white dark:bg-blue-600">
              <lucide-icon [img]="badgeCheckIcon" />
              Verified
            </span>
            <span argusx-badge>
              <lucide-icon [img]="starIcon" />
              Featured
            </span>
            <span argusx-badge variant="destructive">
              <lucide-icon [img]="zapIcon" />
              Critical
            </span>
            <span argusx-badge variant="outline">
              <lucide-icon [img]="shieldIcon" />
              Protected
            </span>
          </div>
        </div>
      </section>

      <!-- Numeric Counters (shadcn demo parity) -->
      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Numeric Counters</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="flex flex-wrap gap-2">
            <span argusx-badge class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">8</span>
            <span argusx-badge variant="destructive" class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">99</span>
            <span argusx-badge variant="outline" class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">20+</span>
            <span argusx-badge variant="secondary" class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">3</span>
          </div>
        </div>
      </section>

      <!-- Link Badges as Anchors (interactive hover) -->
      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Anchor Badges (hover effects)</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="flex flex-wrap gap-2">
            <a argusx-badge href="#" (click)="$event.preventDefault()">Default Link</a>
            <a argusx-badge variant="secondary" href="#" (click)="$event.preventDefault()">Secondary Link</a>
            <a argusx-badge variant="destructive" href="#" (click)="$event.preventDefault()">Destructive Link</a>
            <a argusx-badge variant="outline" href="#" (click)="$event.preventDefault()">Outline Link</a>
          </div>
        </div>
      </section>

      <!-- Complex Combined Scenario -->
      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Combined Scenario</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2">
              <span argusx-badge variant="secondary">
                <lucide-icon [img]="circleDotIcon" />
                Open
              </span>
              <span argusx-badge variant="outline" class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">42</span>
            </div>
            <div class="flex items-center gap-2">
              <a argusx-badge variant="link" href="#" (click)="$event.preventDefault()">View all</a>
              <span argusx-badge variant="destructive">
                <lucide-icon [img]="zapIcon" />
                Urgent
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class BadgePreviewComponent {
  readonly badgeCheckIcon = BadgeCheck;
  readonly starIcon = Star;
  readonly zapIcon = Zap;
  readonly shieldIcon = Shield;
  readonly circleDotIcon = CircleDot;
}
