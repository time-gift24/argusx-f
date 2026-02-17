import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'preview',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./preview/preview-layout.component').then(
            (m) => m.PreviewLayoutComponent
          ),
      },
      {
        path: 'button',
        loadComponent: () =>
          import('./preview/button-preview.component').then(
            (m) => m.ButtonPreviewComponent
          ),
      },
      {
        path: 'input',
        loadComponent: () =>
          import('./preview/input-preview.component').then(
            (m) => m.InputPreviewComponent
          ),
      },
      {
        path: 'select',
        loadComponent: () =>
          import('./preview/select-preview.component').then(
            (m) => m.SelectPreviewComponent
          ),
      },
      {
        path: 'card',
        loadComponent: () =>
          import('./preview/card-preview.component').then(
            (m) => m.CardPreviewComponent
          ),
      },
      {
        path: 'context-menu',
        loadComponent: () =>
          import('./preview/context-menu-preview.component').then(
            (m) => m.ContextMenuPreviewComponent
          ),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./preview/calendar-preview.component').then(
            (m) => m.CalendarPreviewComponent
          ),
      },
      {
        path: 'accordion',
        loadComponent: () =>
          import('./preview/accordion-preview.component').then(
            (m) => m.AccordionPreviewComponent
          ),
      },
      {
        path: 'dialog',
        loadComponent: () =>
          import('./preview/dialog-preview.component').then(
            (m) => m.DialogPreviewComponent
          ),
      },
      {
        path: 'aspect-ratio',
        loadComponent: () =>
          import('../../component-comparisons/aspect-ratio/preview/aspect-ratio-preview.component').then(
            (m) => m.AspectRatioPreviewComponent
          ),
      },
      {
        path: 'alert',
        loadComponent: () =>
          import('./preview/alert-preview.component').then(
            (m) => m.AlertPreviewComponent
          ),
      },
      {
        path: 'avatar',
        loadComponent: () =>
          import('./preview/avatar-preview.component').then(
            (m) => m.AvatarPreviewComponent
          ),
      },
      {
        path: 'liquid-glass',
        loadComponent: () =>
          import('./preview/liquid-glass-preview.component').then(
            (m) => m.LiquidGlassPreviewComponent
          ),
      },
    ],
  },
  {
    path: '',
    redirectTo: 'preview',
    pathMatch: 'full',
  },
];
