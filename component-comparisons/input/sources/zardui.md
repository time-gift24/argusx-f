// zardui Input Component
// Source: zardui.com - Modern Angular component library inspired by shadcn/ui

// From zardui.com website, Input component description:
// "Form input fields with validation and accessibility support."

// Based on zardui patterns (from other components like button):
// - Component-based: ZInput component
// - Uses z- prefix for CSS classes: z-input-*
// - Follows shadcn/ui patterns but for Angular
// - Supports standard HTML input attributes

// zardui Input Component Structure (approximation based on docs):
import { Component, input, forwardRef } from '@angular/core';
import { CVA } from 'class-variance-authority';

const inputVariants = cva(
  'z-input flex h-9 w-full rounded-md border border-z-input bg-transparent px-3 py-1 text-sm transition-all placeholder:text-z-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-z-primary/50 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-z-input',
        error: 'border-red-500 focus-visible:ring-red-500/50',
      },
      size: {
        sm: 'h-8 text-xs',
        default: 'h-9 text-sm',
        lg: 'h-10 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Key features from zardui:
// 1. Component-based (<z-input>)
// 2. CVA for variants
// 3. Validation support (error variant)
// 4. Size variants (sm/default/lg)
// 5. Accessibility support
// 6. Focus ring customization

// References:
// - https://zardui.com/components (shows Input in component list)
// - https://zardui.com/docs/components/input (docs page)
