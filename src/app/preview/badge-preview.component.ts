import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BadgeDirective } from '../../shared/ui/badge';

@Component({
  selector: 'app-badge-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeDirective],
  template: `
    <div class="mx-auto max-w-3xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Badge</h1>
      <p class="mb-8 text-muted-foreground">
        Displays a badge or a component that appears like a badge.
      </p>

      <!-- Variants -->
      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Variants</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="flex flex-wrap gap-2">
            <span appBadge>Default</span>
            <span appBadge variant="secondary">Secondary</span>
            <span appBadge variant="destructive">Destructive</span>
            <span appBadge variant="outline">Outline</span>
            <span appBadge variant="ghost">Ghost</span>
            <span appBadge variant="link">Link</span>
          </div>
        </div>
      </section>

      <!-- With Icons -->
      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Icons</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="flex flex-wrap gap-2">
            <span appBadge>
              <span class="i-lucide-badge-check mr-1"></span>
              With Icon
            </span>
            <span appBadge variant="secondary">
              <span class="i-lucide-star mr-1"></span>
              Starred
            </span>
            <span appBadge variant="destructive">
              <span class="i-lucide-alert-circle mr-1"></span>
              Error
            </span>
          </div>
        </div>
      </section>

      <!-- Link asChild -->
      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">As Link</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="flex flex-wrap gap-2">
            <a appBadge variant="link" href="#" class="hover:underline">
              Link Badge
              <span class="i-lucide-arrow-up-right ml-1"></span>
            </a>
          </div>
        </div>
      </section>

      <!-- Custom Colors -->
      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Custom Colors</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="flex flex-wrap gap-2">
            <span appBadge class="bg-blue-600 text-white">Blue</span>
            <span appBadge class="bg-green-600 text-white">Green</span>
            <span appBadge class="bg-purple-600 text-white">Purple</span>
            <span appBadge class="bg-orange-600 text-white">Orange</span>
          </div>
        </div>
      </section>

      <!-- Sizes -->
      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Small Numbers</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="flex flex-wrap items-center gap-2">
            <span appBadge class="px-1 font-mono tabular-nums">8</span>
            <span appBadge class="px-1 font-mono tabular-nums">99</span>
            <span appBadge variant="secondary" class="px-1 font-mono tabular-nums">99+</span>
            <span appBadge variant="destructive" class="px-1 font-mono tabular-nums">999+</span>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class BadgePreviewComponent {}
