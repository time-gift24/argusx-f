# sidebar API Diff

## API Matrix

| API | Local (app-sidebar-*) | Shadcn | Target (argusx-sidebar-*) | Decision |
|-----|---------------------|--------|-------------------------|----------|
| selector | app-sidebar-provider | SidebarProvider | argusx-sidebar-provider | rename |
| selector | app-sidebar | Sidebar | argusx-sidebar | rename |
| selector | app-sidebar-trigger | SidebarTrigger | argusx-sidebar-trigger | rename |
| selector | app-sidebar-inset | SidebarInset | argusx-sidebar-inset | rename |
| selector | app-sidebar-header | - | argusx-sidebar-header | extend (ArgusX) |
| selector | app-sidebar-content | SidebarContent | argusx-sidebar-content | rename |
| selector | app-sidebar-footer | - | argusx-sidebar-footer | extend (ArgusX) |
| selector | app-sidebar-group | SidebarGroup | argusx-sidebar-group | rename |
| selector | app-sidebar-group-label | SidebarGroupLabel | argusx-sidebar-group-label | rename |
| selector | app-sidebar-menu | SidebarMenu | argusx-sidebar-menu | rename |
| selector | app-sidebar-menu-item | SidebarMenuItem | argusx-sidebar-menu-item | rename |
| selector | app-sidebar-menu-button | SidebarMenuButton | argusx-sidebar-menu-button | rename |
| selector | app-sidebar-separator | - | argusx-sidebar-separator | extend (ArgusX) |
| selector | app-sidebar-input | - | argusx-sidebar-input | extend (ArgusX) |
| defaultOpen input | defaultOpen | defaultOpen | defaultOpen | no conflict |
| collapsible input | collapsible | - | collapsible | extend (ArgusX) |
| side input | side | - | side | extend (ArgusX) |
| class input | class | className | class | no conflict (Angular style) |
| contained input | contained | - | contained | extend (ArgusX) |
| isActive input | isActive | - | isActive | extend (ArgusX) |
| data-slot attr | data-slot | data-slot | data-slot | align |

## Conflict Decisions
- 无冲突项：selector 命名从 app-* 迁移到 argusx-* 属于重构，不涉及 shadcn 冲突

## Non-conflict Extensions
| API | Type | Description | Plain Style |
|-----|------|-------------|-------------|
| collapsible | Input<'offcanvas' \| 'icon' \| 'none'> | 折叠模式 | 默认 'offcanvas' |
| side | Input<'left' \| 'right'> | 侧边位置 | 默认 'left' |
| contained | Input<boolean> | 是否 contained 模式 | 默认 false |
| isActive | Input<boolean> | 菜单按钮激活状态 | 默认 false |
| header/footer | Component | 布局组件 | plain 样式 |
| separator | Component | 分割线组件 | plain 样式 |
| input | Component | 输入框组件 | plain 样式 |

## Missing APIs
- 无 (本地已有完整实现)

## Behavior Mismatches
- 无

## Final Target API
```typescript
// SidebarProvider
@Component({
  selector: 'argusx-sidebar-provider',
  ...
})
export class SidebarProviderComponent {
  readonly defaultOpen = input<boolean>(true);
}

// Sidebar
@Component({
  selector: 'argusx-sidebar',
  ...
})
export class SidebarComponent {
  readonly collapsible = input<'offcanvas' | 'icon' | 'none'>('offcanvas');
  readonly side = input<'left' | 'right'>('left');
  readonly class = input<string>('');
  readonly contained = input<boolean>(false);
}

// SidebarTrigger
@Component({
  selector: 'argusx-sidebar-trigger',
  ...
})
export class SidebarTriggerComponent {
  readonly class = input<string>('');
}

// SidebarInset
@Component({
  selector: 'argusx-sidebar-inset',
  ...
})
export class SidebarInsetComponent {
  readonly class = input<string>('');
}

// SidebarHeader
@Component({
  selector: 'argusx-sidebar-header',
  ...
})
export class SidebarHeaderComponent {
  readonly class = input<string>('');
}

// SidebarContent
@Component({
  selector: 'argusx-sidebar-content',
  ...
})
export class SidebarContentComponent {
  readonly class = input<string>('');
}

// SidebarFooter
@Component({
  selector: 'argusx-sidebar-footer',
  ...
})
export class SidebarFooterComponent {
  readonly class = input<string>('');
}

// SidebarGroup
@Component({
  selector: 'argusx-sidebar-group',
  ...
})
export class SidebarGroupComponent {
  readonly class = input<string>('');
}

// SidebarGroupLabel
@Component({
  selector: 'argusx-sidebar-group-label',
  ...
})
export class SidebarGroupLabelComponent {
  readonly class = input<string>('');
}

// SidebarMenu
@Component({
  selector: 'argusx-sidebar-menu',
  ...
})
export class SidebarMenuComponent {
  readonly class = input<string>('');
}

// SidebarMenuItem
@Component({
  selector: 'argusx-sidebar-menu-item',
  ...
})
export class SidebarMenuItemComponent {
  readonly class = input<string>('');
}

// SidebarMenuButton
@Component({
  selector: 'argusx-sidebar-menu-button',
  ...
})
export class SidebarMenuButtonComponent {
  readonly class = input<string>('');
  readonly isActive = input<boolean>(false);
}

// SidebarSeparator
@Component({
  selector: 'argusx-sidebar-separator',
  ...
})
export class SidebarSeparatorComponent {
  readonly class = input<string>('');
}

// SidebarInput
@Component({
  selector: 'argusx-sidebar-input',
  ...
})
export class SidebarInputComponent {
  readonly class = input<string>('');
}

// SidebarService
@Injectable({ providedIn: 'root' })
export class SidebarService {
  readonly state = signal<'expanded' | 'collapsed'>('expanded');
  readonly isMobile = signal<boolean>(false);
  readonly openMobile = signal<boolean>(false);
  toggle(): void
  setState(state: 'expanded' | 'collapsed'): void
  setOpenMobile(open: boolean): void
  setIsMobile(isMobile: boolean): void
}
```
