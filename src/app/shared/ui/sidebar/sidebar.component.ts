import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '../../utils/cn';
import { LucideAngularModule, PanelLeft } from 'lucide-angular';
import { SidebarService } from './sidebar.service';

// ============================================================================
// Types
// ============================================================================

export type SidebarState = 'expanded' | 'collapsed';

// ============================================================================
// Sidebar Provider
// ============================================================================

@Component({
  selector: 'argusx-sidebar-provider',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"sidebar-provider"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarProviderComponent {
  readonly sidebarService = inject(SidebarService);
  readonly defaultOpen = input<boolean>(true);

  constructor() {
    this.sidebarService.setState(this.defaultOpen() ? 'expanded' : 'collapsed');
  }
}

// ============================================================================
// Sidebar Component
// ============================================================================

@Component({
  selector: 'argusx-sidebar',
  imports: [CommonModule],
  template: `
    <div [class]="containerClass()">
      <div [class]="gapClass()"></div>
      <div [class]="sidebarClass()">
        <div [class]="innerClass()">
          <ng-content />
        </div>
      </div>
    </div>
  `,
  host: {
    '[attr.data-slot]': '"sidebar"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly sidebarService = inject(SidebarService);
  readonly collapsible = input<'offcanvas' | 'icon' | 'none'>('offcanvas');
  readonly side = input<'left' | 'right'>('left');
  readonly class = input<string>('');
  /**
   * When true, the sidebar is positioned absolutely within its container
   * instead of fixed to the viewport. Use this for contained/demo layouts.
   */
  readonly contained = input<boolean>(false);

  protected readonly state = this.sidebarService.state;

  protected readonly containerClass = computed(() =>
    cn(
      'group peer text-sidebar-foreground hidden md:block',
      this.contained() && 'contents',
      this.class()
    )
  );

  protected readonly gapClass = computed(() => {
    const isCollapsed = this.state() === 'collapsed';
    return cn(
      'transition-[width] duration-200 ease-linear relative',
      this.contained() ? 'hidden' : 'w-[--sidebar-width]',
      this.collapsible() === 'offcanvas' && isCollapsed && 'w-0'
    );
  });

  protected readonly sidebarClass = computed(() => {
    const isCollapsed = this.state() === 'collapsed';
    const side = this.side();
    const isContained = this.contained();

    return cn(
      isContained ? 'absolute inset-y-0' : 'fixed inset-y-0',
      'z-10 hidden h-full w-[--sidebar-width] transition-[left,right,width] duration-200 ease-linear',
      side === 'left' ? 'left-0' : 'right-0',
      side === 'left' && this.collapsible() === 'offcanvas' && isCollapsed && 'left-[calc(var(--sidebar-width)*-1)]',
      side === 'right' && this.collapsible() === 'offcanvas' && isCollapsed && 'right-[calc(var(--sidebar-width)*-1)]',
      'md:flex',
      side === 'left' && 'border-r'
    );
  });

  protected readonly innerClass = computed(() =>
    cn('bg-sidebar flex size-full flex-col')
  );
}

// ============================================================================
// Sidebar Trigger
// ============================================================================

@Component({
  selector: 'argusx-sidebar-trigger',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <button [class]="computedClass()" (click)="onClick()" aria-label="Toggle Sidebar">
      <lucide-icon [img]="panelLeftIcon" class="size-4"></lucide-icon>
      <span class="sr-only">Toggle Sidebar</span>
    </button>
  `,
  host: {
    '[attr.data-slot]': '"sidebar-trigger"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarTriggerComponent {
  readonly sidebarService = inject(SidebarService);
  readonly class = input<string>('');
  readonly panelLeftIcon = PanelLeft;

  protected readonly computedClass = computed(() =>
    cn(
      'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground inline-flex items-center justify-center rounded-md p-2 text-xs transition-colors',
      this.class()
    )
  );

  onClick(): void {
    this.sidebarService.toggle();
  }
}

// ============================================================================
// Sidebar Inset
// ============================================================================

@Component({
  selector: 'argusx-sidebar-inset',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"sidebar-inset"',
    '[class]': 'computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarInsetComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('bg-background relative flex w-full flex-1 flex-col', this.class())
  );
}

// ============================================================================
// Sidebar Header
// ============================================================================

@Component({
  selector: 'argusx-sidebar-header',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"sidebar-header"',
    '[class]': 'computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarHeaderComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('gap-2 p-2 flex flex-col', this.class())
  );
}

// ============================================================================
// Sidebar Content
// ============================================================================

@Component({
  selector: 'argusx-sidebar-content',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"sidebar-content"',
    '[class]': 'computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarContentComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('flex min-h-0 flex-1 flex-col overflow-auto', this.class())
  );
}

// ============================================================================
// Sidebar Footer
// ============================================================================

@Component({
  selector: 'argusx-sidebar-footer',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"sidebar-footer"',
    '[class]': 'computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarFooterComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('gap-2 p-2 flex flex-col mt-auto', this.class())
  );
}

// ============================================================================
// Sidebar Group
// ============================================================================

@Component({
  selector: 'argusx-sidebar-group',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"sidebar-group"',
    '[class]': 'computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarGroupComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('px-2 py-1 relative flex w-full min-w-0 flex-col', this.class())
  );
}

// ============================================================================
// Sidebar Group Label
// ============================================================================

@Component({
  selector: 'argusx-sidebar-group-label',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"sidebar-group-label"',
    '[class]': 'computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarGroupLabelComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('text-sidebar-foreground/70 h-8 rounded-md px-2 text-xs font-medium', this.class())
  );
}

// ============================================================================
// Sidebar Menu
// ============================================================================

@Component({
  selector: 'argusx-sidebar-menu',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"sidebar-menu"',
    '[class]': 'computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarMenuComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('gap-px flex w-full min-w-0 flex-col', this.class())
  );
}

// ============================================================================
// Sidebar Menu Item
// ============================================================================

@Component({
  selector: 'argusx-sidebar-menu-item',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"sidebar-menu-item"',
    '[class]': 'computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarMenuItemComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('group/menu-item relative', this.class())
  );
}

// ============================================================================
// Sidebar Menu Button
// ============================================================================

@Component({
  selector: 'argusx-sidebar-menu-button',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"sidebar-menu-button"',
    '[class]': 'computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarMenuButtonComponent {
  readonly class = input<string>('');
  readonly isActive = input<boolean>(false);

  protected readonly computedClass = computed(() =>
    cn(
      'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground gap-2 rounded-md p-2 text-xs transition-colors flex w-full items-center overflow-hidden outline-none disabled:pointer-events-none disabled:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0',
      this.isActive() && 'bg-sidebar-accent text-sidebar-accent-foreground font-medium',
      this.class()
    )
  );
}

// ============================================================================
// Sidebar Separator
// ============================================================================

@Component({
  selector: 'argusx-sidebar-separator',
  imports: [CommonModule],
  template: ``,
  host: {
    '[attr.data-slot]': '"sidebar-separator"',
    '[class]': 'computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarSeparatorComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('bg-sidebar-border mx-2 w-auto h-px my-2', this.class())
  );
}

// ============================================================================
// Sidebar Input
// ============================================================================

@Component({
  selector: 'argusx-sidebar-input',
  imports: [CommonModule],
  template: `<input [class]="computedClass()" />`,
  host: {
    '[attr.data-slot]': '"sidebar-input"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarInputComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('bg-muted/20 border-input h-8 w-full rounded-md px-3 py-1 text-xs', this.class())
  );
}

// ============================================================================
// Exports
// ============================================================================

export const SidebarComponents = [
  SidebarProviderComponent,
  SidebarComponent,
  SidebarTriggerComponent,
  SidebarInsetComponent,
  SidebarHeaderComponent,
  SidebarContentComponent,
  SidebarFooterComponent,
  SidebarGroupComponent,
  SidebarGroupLabelComponent,
  SidebarMenuComponent,
  SidebarMenuItemComponent,
  SidebarMenuButtonComponent,
  SidebarSeparatorComponent,
  SidebarInputComponent,
];
