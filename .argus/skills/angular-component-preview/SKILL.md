---
name: angular-component-preview
description: Use when adding new component previews to the angular-shadcn preview system at /preview with navbar + iframe layout
---

# Angular Component Preview

## Overview

Add component previews to the angular-shadcn preview system. The system uses a main layout with left navbar + right iframe to display component examples in isolation.

## Directory Structure

```
src/app/features/preview/
├── preview-layout.component.ts    # Main layout (navbar + iframe)
├── button-preview.component.ts    # Button component example
└── input-preview.component.ts     # Input component example
```

## Core Pattern

### 1. Add Navigation to PreviewLayoutComponent

Update `preview-layout.component.ts`:

```typescript
// Extend the signal type
readonly currentPreview = signal<'button' | 'input' | 'new-component'>('button');

// Add navbar button
<button
  (click)="setPreview('new-component')"
  class="w-full text-left block rounded-md px-2.5 py-1.5 text-xs transition-colors {{
    currentPreview() === 'new-component'
      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
  }}"
>
  NewComponent
</button>

// Update setPreview method
setPreview(component: 'button' | 'input' | 'new-component'): void {
  this.currentPreview.set(component);
}
```

### 2. Add Route in app.routes.ts

```typescript
{
  path: 'new-component',
  loadComponent: () =>
    import('./features/preview/new-component-preview.component').then(
      (m) => m.NewComponentPreviewComponent
    ),
},
```

### 3. Create Preview Component

Follow this template structure:

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { YourComponent } from '../../shared/ui/your-component';

@Component({
  selector: 'app-your-component-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [YourComponent],
  template: `
    <div class="mx-auto max-w-3xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">ComponentName</h1>
      <p class="mb-8 text-muted-foreground">
        Component description.
      </p>

      <!-- Section 1 -->
      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Section Title</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <!-- Component examples -->
        </div>
      </section>
    </div>
  `,
})
export class YourComponentPreviewComponent {}
```

## Key Patterns

| Pattern | Implementation |
|---------|----------------|
| **Navigation** | Use click handler (`(click)="setPreview(...)"`) NOT routerLink |
| **Iframe src** | Use `DomSanitizer.bypassSecurityTrustResourceUrl()` |
| **Section title** | `text-sm font-medium text-muted-foreground` |
| **Section container** | `rounded-lg border border-dashed border-border p-6` |
| **Page width** | `mx-auto max-w-3xl p-8` |

## Common Mistakes

1. **Using routerLink** - This causes full page navigation. Use click handler with signal instead.
2. **Missing DomSanitizer** - iframe src must be sanitized with `bypassSecurityTrustResourceUrl()`
3. **Wrong styling** - Always use the exact classes from the template above for consistency
