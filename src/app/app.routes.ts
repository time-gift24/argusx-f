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
        path: 'card',
        loadComponent: () =>
          import('./preview/card-preview.component').then(
            (m) => m.CardPreviewComponent
          ),
      }
    ],
  },
  {
    path: '',
    redirectTo: 'preview',
    pathMatch: 'full',
  },
];
