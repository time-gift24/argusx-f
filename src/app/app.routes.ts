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
      {
        path: 'llm-chat',
        loadComponent: () =>
          import('./preview/llm-chat-preview.component').then(
            (m) => m.LlmChatPreviewComponent
          ),
      },
      {
        path: 'markdown',
        loadComponent: () =>
          import('./preview/markdown-preview.component').then(
            (m) => m.MarkdownPreviewComponent
          ),
      },
      {
        path: 'alert-dialog',
        loadComponent: () =>
          import('./preview/alert-dialog-preview.component').then(
            (m) => m.AlertDialogPreviewComponent
          ),
      },
      {
        path: 'badge',
        loadComponent: () =>
          import('./preview/badge-preview.component').then(
            (m) => m.BadgePreviewComponent
          ),
      },
      {
        path: 'breadcrumb',
        loadComponent: () =>
          import('./preview/breadcrumb-preview.component').then(
            (m) => m.BreadcrumbPreviewComponent
          ),
      },
      {
        path: 'button-group',
        loadComponent: () =>
          import('./preview/button-group-preview.component').then(
            (m) => m.ButtonGroupPreviewComponent
          ),
      },
      {
        path: 'carousel',
        loadComponent: () =>
          import('./preview/carousel-preview.component').then(
            (m) => m.CarouselPreviewComponent
          ),
      },
      {
        path: 'chart',
        loadComponent: () =>
          import('./preview/chart-preview.component').then(
            (m) => m.ChartPreviewComponent
          ),
      },
      {
        path: 'checkbox',
        loadComponent: () =>
          import('./preview/checkbox-preview.component').then(
            (m) => m.CheckboxPreviewComponent
          ),
      },
      {
        path: 'collapsible',
        loadComponent: () =>
          import('./preview/collapsible-preview.component').then(
            (m) => m.CollapsiblePreviewComponent
          ),
      },
      {
        path: 'combobox',
        loadComponent: () =>
          import('./preview/combobox-preview.component').then(
            (m) => m.ComboboxPreviewComponent
          ),
      },
      {
        path: 'command',
        loadComponent: () =>
          import('./preview/command-preview.component').then(
            (m) => m.CommandPreviewComponent
          ),
      },
      {
        path: 'drawer',
        loadComponent: () =>
          import('./preview/drawer-preview.component').then(
            (m) => m.DrawerPreviewComponent
          ),
      },
      {
        path: 'dropdown-menu',
        loadComponent: () =>
          import('./preview/dropdown-menu-preview.component').then(
            (m) => m.DropdownMenuPreviewComponent
          ),
      },
      {
        path: 'empty',
        loadComponent: () =>
          import('./preview/empty-preview.component').then(
            (m) => m.EmptyPreviewComponent
          ),
      },
      {
        path: 'field',
        loadComponent: () =>
          import('./preview/field-preview.component').then(
            (m) => m.FieldPreviewComponent
          ),
      },
      {
        path: 'hover-card',
        loadComponent: () =>
          import('./preview/hover-card-preview.component').then(
            (m) => m.HoverCardPreviewComponent
          ),
      },
      {
        path: 'input-group',
        loadComponent: () =>
          import('./preview/input-group-preview.component').then(
            (m) => m.InputGroupPreviewComponent
          ),
      },
      {
        path: 'input-otp',
        loadComponent: () =>
          import('./preview/input-otp-preview.component').then(
            (m) => m.InputOtpPreviewComponent
          ),
      },
      {
        path: 'kbd',
        loadComponent: () =>
          import('./preview/kbd-preview.component').then(
            (m) => m.KbdPreviewComponent
          ),
      },
      {
        path: 'label',
        loadComponent: () =>
          import('./preview/label-preview.component').then(
            (m) => m.LabelPreviewComponent
          ),
      },
      {
        path: 'menubar',
        loadComponent: () =>
          import('./preview/menubar-preview.component').then(
            (m) => m.MenubarPreviewComponent
          ),
      },
      {
        path: 'native-select',
        loadComponent: () =>
          import('./preview/native-select-preview.component').then(
            (m) => m.NativeSelectPreviewComponent
          ),
      },
      {
        path: 'pagination',
        loadComponent: () =>
          import('./preview/pagination-preview.component').then(
            (m) => m.PaginationPreviewComponent
          ),
      },
      {
        path: 'popover',
        loadComponent: () =>
          import('./preview/popover-preview.component').then(
            (m) => m.PopoverPreviewComponent
          ),
      },
      {
        path: 'progress',
        loadComponent: () =>
          import('./preview/progress-preview.component').then(
            (m) => m.ProgressPreviewComponent
          ),
      },
      {
        path: 'radio-group',
        loadComponent: () =>
          import('./preview/radio-group-preview.component').then(
            (m) => m.RadioGroupPreviewComponent
          ),
      },
      {
        path: 'resizable',
        loadComponent: () =>
          import('./preview/resizable-preview.component').then(
            (m) => m.ResizablePreviewComponent
          ),
      },
      {
        path: 'scroll-area',
        loadComponent: () =>
          import('./preview/scroll-area-preview.component').then(
            (m) => m.ScrollAreaPreviewComponent
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
        path: 'separator',
        loadComponent: () =>
          import('./preview/separator-preview.component').then(
            (m) => m.SeparatorPreviewComponent
          ),
      },
      {
        path: 'sheet',
        loadComponent: () =>
          import('./preview/sheet-preview.component').then(
            (m) => m.SheetPreviewComponent
          ),
      },
      {
        path: 'skeleton',
        loadComponent: () =>
          import('./preview/skeleton-preview.component').then(
            (m) => m.SkeletonPreviewComponent
          ),
      },
      {
        path: 'spinner',
        loadComponent: () =>
          import('./preview/spinner-preview.component').then(
            (m) => m.SpinnerPreviewComponent
          ),
      },
      {
        path: 'table',
        loadComponent: () =>
          import('./preview/table-preview.component').then(
            (m) => m.TablePreviewComponent
          ),
      },
      {
        path: 'tabs',
        loadComponent: () =>
          import('./preview/tabs-preview.component').then(
            (m) => m.TabsPreviewComponent
          ),
      },
      {
        path: 'textarea',
        loadComponent: () =>
          import('./preview/textarea-preview.component').then(
            (m) => m.TextareaPreviewComponent
          ),
      },
      {
        path: 'toast',
        loadComponent: () =>
          import('./preview/toast-preview.component').then(
            (m) => m.ToastPreviewComponent
          ),
      },
      {
        path: 'toggle',
        loadComponent: () =>
          import('./preview/toggle-preview.component').then(
            (m) => m.TogglePreviewComponent
          ),
      },
      {
        path: 'toggle-group',
        loadComponent: () =>
          import('./preview/toggle-group-preview.component').then(
            (m) => m.ToggleGroupPreviewComponent
          ),
      },
      {
        path: 'tooltip',
        loadComponent: () =>
          import('./preview/tooltip-preview.component').then(
            (m) => m.TooltipPreviewComponent
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
