# Drawer Component Capability Analysis

## 1. Overview

| Item | Details |
|------|---------|
| **Component** | drawer |
| **Local Path** | `src/app/shared/ui/drawer/` |
| **Zardui Path** | Not found (uses `dialog` instead) |
| **Shadcn Registry** | `@shadcn/drawer` |
| **Shadcn Dependency** | `vaul` |

## 2. Local Implementation

### 2.1 Architecture

The local drawer implementation uses **Angular CDK Overlay** for the slide-out panel presentation.

**Files:**
- `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/drawer/drawer.component.ts`
- `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/drawer/index.ts`

### 2.2 Components & Directives

| Component/Directive | Type | Description |
|---------------------|------|-------------|
| `DrawerComponent` | Component | Root component with CDK Overlay |
| `DrawerTriggerDirective` | Directive | Opens drawer on click |
| `DrawerPortalComponent` | Directive | Placeholder for API compatibility |
| `DrawerOverlayComponent` | Component | Semi-transparent backdrop |
| `DrawerCloseDirective` | Directive | Closes drawer on click |
| `DrawerContentComponent` | Component | Main drawer panel with drag handle |
| `DrawerHeaderComponent` | Component | Container for title/description |
| `DrawerFooterComponent` | Component | Container for action buttons |
| `DrawerTitleComponent` | Component | Accessible title |
| `DrawerDescriptionComponent` | Component | Accessible description |

### 2.3 API Surface

**Inputs:**
```typescript
readonly open = model<boolean>(false)           // Two-way binding
readonly direction = input<DrawerDirection>('bottom')  // 'left' | 'right' | 'top' | 'bottom'
readonly size = input<DrawerSize>('default')    // 'sm' | 'default' | 'lg' | 'xl' | 'full'
readonly class = input<string>('')              // Custom CSS classes
readonly dismissible = input<boolean>(true)    // Allow dismiss by backdrop/escape
readonly shouldScaleBackground = input<boolean>(false) // Background scale effect
```

**Outputs:**
```typescript
readonly openChange = output<boolean>()        // Open state change event
readonly closeClick = output<void>()           // Close button click event
```

**Methods:**
```typescript
openDrawer(): void
closeDrawer(): void
toggleDrawer(): void
```

### 2.4 Accessibility Features

- `role="dialog"` + `aria-modal="true"`
- `aria-labelledby` pointing to title
- `aria-describedby` pointing to description
- Focus trap via `cdkTrapFocus`
- Escape key closes drawer
- Click outside closes drawer (configurable)
- Swipe to close gesture support

### 2.5 Animation Support

Uses Tailwind CSS animation classes:
- Slide animations: `slide-in-from-*` / `slide-out-to-*`
- Fade animations: `fade-in-0` / `fade-out-0`
- Backdrop blur: `backdrop-blur-xs` (with feature detection)

## 3. Zardui Implementation

**Status:** Not found

Zardui does not have a dedicated drawer component. The `dialog` component is used instead for modal-like presentations.

## 4. Shadcn Implementation

### 4.1 Source

Shadcn uses the **Vaul** library (headless drawer component for React).

### 4.2 API Comparison

| Feature | Local (Angular) | Shadcn (React + Vaul) |
|---------|-----------------|----------------------|
| Direction | `left`, `right`, `top`, `bottom` | Via Vaul (direction prop) |
| Size | `sm`, `default`, `lg`, `xl`, `full` | Via CSS classes |
| Portal | Yes (CDK Portal) | Yes (Vaull Portal) |
| Overlay | Yes | Yes |
| Gestures | Swipe to close | Built-in with Vaul |
| Focus Trap | Yes (cdkTrapFocus) | Yes (Vaul) |
| A11y | Full support | Full support |

### 4.3 Example Usage (Shadcn)

```tsx
<Drawer>
  <DrawerTrigger asChild>
    <Button variant="outline">Open Drawer</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Move Goal</DrawerTitle>
      <DrawerDescription>Set your daily activity goal.</DrawerDescription>
    </DrawerHeader>
    <div className="p-4 pb-0">
      {/* Content */}
    </div>
    <DrawerFooter>
      <Button>Submit</Button>
      <DrawerClose asChild>
        <Button variant="outline">Cancel</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

## 5. Gap Analysis

### 5.1 Features Available in Local but Not in Shadcn

| Feature | Local | Shadcn | Notes |
|---------|-------|--------|-------|
| Direction control | Full | Via Vaul | Both support 4 directions |
| Size presets | 5 sizes | Via CSS | Local has predefined sizes |
| Dismissible toggle | Yes | Built-in | Both support |
| Background scale | Yes | Not available | Local has `shouldScaleBackground` |
| Swipe gestures | Yes | Via Vaul | Both support |

### 5.2 Features Available in Shadcn but Not in Local

| Feature | Notes |
|---------|-------|
| Vaul integration | Shadcn uses Vaul library which provides additional features |
| Built-in drag handle animation | Vaul provides smooth drag animations |

## 6. Recommendations

### 6.1 Current Local Implementation is Feature-Complete

The local Angular implementation provides:
- All essential drawer functionality
- Full accessibility support
- Multiple directions and sizes
- Gesture support (swipe to close)
- Proper focus management

### 6.2 Potential Improvements

1. **Vaul Integration**: Consider integrating Vaul library for smoother drag animations (matching shadcn behavior)
2. **Background Scale**: The `shouldScaleBackground` feature could be enhanced with actual background scaling animation
3. **Dynamic Sizing**: Add support for custom width/height values beyond presets

## 7. Conclusion

The local drawer component is well-implemented and covers all major use cases. It provides a robust alternative to the shadcn/vaul implementation while maintaining Angular-specific patterns (Signals, CDK Overlay, OnPush change detection).
