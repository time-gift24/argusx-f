# Sonner (Toast) Component Analysis

## Overview

| Item | Details |
|------|---------|
| **Component Name** | sonner (toast) |
| **Local Path** | `src/app/shared/ui/toast/` |
| **Zardui Path** | N/A (does not exist) |
| **Shadcn Registry** | `@shadcn/sonner` (registry:ui) |
| **Dependencies** | `sonner`, `next-themes` |

---

## Local Implementation

### Files

| File | Purpose |
|------|---------|
| `src/app/shared/ui/toast/index.ts` | Public exports |
| `src/app/shared/ui/toast/toast.service.ts` | Toast state management & API |
| `src/app/shared/ui/toast/toast.component.ts` | Toast UI components |

### Architecture

The local implementation follows a **Service + Component** pattern:

```
ToastService (Signal-based state)
    |
    +---> ToastContainerComponent (renders all toasts)
              |
              +---> ToastItemComponent (individual toast)
```

### Features

| Feature | Status | Notes |
|---------|--------|-------|
| **Toast Types** | Supported | success, error, warning, info, loading |
| **Positioning** | Supported | 6 positions: top-left, top-center, top-right, bottom-left, bottom-center, bottom-right |
| **Auto-dismiss** | Supported | Default 5000ms, configurable per toast |
| **Manual Dismiss** | Supported | Close button + programmatic dismiss |
| **Action Button** | Supported | Custom action with onClick handler |
| **Title + Description** | Supported | Two-line content support |
| **Loading State** | Supported | Spinning icon, non-dismissible by default |
| **Animations** | Supported | Slide + fade animations via data attributes |
| **Duration Control** | Supported | Set to 0 for infinite (manual dismiss only) |
| **Multiple Toasts** | Supported | Stacked in container |

### Service API

```typescript
// Methods
toast.success(title, description?, options?)
toast.error(title, description?, options?)
toast.warning(title, description?, options?)
toast.info(title, description?, options?)
toast.loading(title, description?, options?)

toast.dismiss(id: string): void
toast.dismissAll(): void
toast.setPosition(position: ToastPosition): void
```

### Toast Interface

```typescript
interface Toast {
  id: string;
  title?: string;
  description?: string;
  type: ToastType;  // 'success' | 'error' | 'warning' | 'info' | 'loading'
  state?: ToastState;  // 'show' | 'hide'
  duration?: number;  // milliseconds
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

### Technical Details

- **State Management**: Angular Signals (`signal<Toast[]>`, `signal<ToastPosition>`)
- **Change Detection**: `OnPush` strategy
- **Icons**: Lucide Angular icons (CircleCheck, Info, TriangleAlert, OctagonX, Loader2)
- **Styling**: Tailwind CSS with semantic tokens (success, destructive, warning, info)
- **Accessibility**: `role="alert"`, `aria-live="polite"`, `aria-atomic="true"`

---

## Shadcn Sonner

### Registry Info

- **Type**: `registry:ui`
- **Dependencies**: `sonner`, `next-themes`
- **Related Examples**: `sonner-demo`, `sonner-types`

### Shadcn Usage (React/Next.js)

```tsx
import { toast } from "sonner"

toast("Event has been created", {
  description: "Sunday, December 03, 2023 at 9:00 AM",
  action: {
    label: "Undo",
    onClick: () => console.log("Undo"),
  },
})
```

### Comparison

| Feature | Local (Angular) | Shadcn (React) |
|---------|-----------------|-----------------|
| Framework | Angular | React/Next.js |
| State | Signals | Internal sonner |
| Types | 5 (success, error, warning, info, loading) | Core + custom |
| Position | 6 positions | 9 positions |
| Promise support | No | Yes |
| Promise toast | N/A | `toast.promise()` |
| Custom component | No | Yes (via `toast()`) |
| Swipe to dismiss | No | Yes |
| Close on click | No | Optional |
| Duration | 5000ms default | 4000ms default |

---

## Feature Gap Analysis

### Implemented (Local)

- [x] Basic toast types (success, error, warning, info, loading)
- [x] Title + description
- [x] Action button
- [x] Auto-dismiss with configurable duration
- [x] Manual dismiss
- [x] Position control
- [x] Animations
- [x] Accessibility attributes

### Missing / Future Considerations

| Feature | Priority | Notes |
|---------|----------|-------|
| Promise-based toast | Low | React sonner specific, less relevant for Angular |
| Swipe to dismiss | Low | Mobile enhancement |
| Custom component content | Medium | Could extend action support |
| Sound notification | Low | Not typical for Angular apps |
| Queue management | Low | Current implementation stacks all toasts |

---

## Preview Usage

See `src/app/preview/toast-preview.component.ts` for live demonstration.

```typescript
// Example usage in component
constructor(private toast: ToastService) {}

showSuccess(): void {
  this.toast.success('Saved', 'Your profile has been updated.');
}

showError(): void {
  this.toast.error('Failed', 'Could not connect to the server.');
}
```

---

## Conclusion

The local sonner/toast implementation provides **comparable functionality** to shadcn's sonner for Angular applications. Key strengths:

1. **Signal-based state** - Modern Angular pattern
2. **Full typing** - TypeScript strict mode compliant
3. **Accessible** - ARIA attributes properly set
4. **Flexible positioning** - 6 positions supported
5. **Animations** - Smooth enter/exit transitions

The implementation aligns well with the project's Angular v20+ standards and does not require shadcn migration.
