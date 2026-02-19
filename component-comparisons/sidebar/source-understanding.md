# sidebar Source Understanding

## Mapping
- local: `sidebar`
- zardui: `sidebar`
- shadcn: `sidebar`
- rationale: 本组件已有完整实现，包含多个子组件，需要对齐 shadcn API 并迁移到 argusx 前缀

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | /tmp/zardui/libs/zard/src/lib/shared/components/layout/sidebar.component.ts | 26-106 | z-sidebar 主组件，包含 zWidth/zCollapsedWidth/zCollapsible/zCollapsed/zReverseArrow 等输入 |
| Z2 | /tmp/zardui/libs/zard/src/lib/shared/components/layout/sidebar.component.ts | 108-141 | z-sidebar-group, z-sidebar-group-label 子组件 |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | shadcn registry sidebar-demo | - | 完整 sidebar 使用示例，包含 SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarInset, SidebarTrigger |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | src/app/shared/ui/sidebar/sidebar.component.ts | 17-33 | SidebarProviderComponent: selector='app-sidebar-provider', defaultOpen input |
| L2 | src/app/shared/ui/sidebar/sidebar.component.ts | 39-106 | SidebarComponent: selector='app-sidebar', collapsible/side/class/contained inputs |
| L3 | src/app/shared/ui/sidebar/sidebar.component.ts | 112-141 | SidebarTriggerComponent: selector='app-sidebar-trigger' |
| L4 | src/app/shared/ui/sidebar/sidebar.component.ts | 147-163 | SidebarInsetComponent: selector='app-sidebar-inset' |
| L5 | src/app/shared/ui/sidebar/sidebar.component.ts | 169-185 | SidebarHeaderComponent: selector='app-sidebar-header' |
| L6 | src/app/shared/ui/sidebar/sidebar.component.ts | 191-207 | SidebarContentComponent: selector='app-sidebar-content' |
| L7 | src/app/shared/ui/sidebar/sidebar.component.ts | 213-229 | SidebarFooterComponent: selector='app-sidebar-footer' |
| L8 | src/app/shared/ui/sidebar/sidebar.component.ts | 235-251 | SidebarGroupComponent: selector='app-sidebar-group' |
| L9 | src/app/shared/ui/sidebar/sidebar.component.ts | 257-273 | SidebarGroupLabelComponent: selector='app-sidebar-group-label' |
| L10 | src/app/shared/ui/sidebar/sidebar.component.ts | 279-295 | SidebarMenuComponent: selector='app-sidebar-menu' |
| L11 | src/app/shared/ui/sidebar/sidebar.component.ts | 301-317 | SidebarMenuItemComponent: selector='app-sidebar-menu-item' |
| L12 | src/app/shared/ui/sidebar/sidebar.component.ts | 323-344 | SidebarMenuButtonComponent: selector='app-sidebar-menu-button', isActive input |
| L13 | src/app/shared/ui/sidebar/sidebar.component.ts | 350-366 | SidebarSeparatorComponent: selector='app-sidebar-separator' |
| L14 | src/app/shared/ui/sidebar/sidebar.component.ts | 372-387 | SidebarInputComponent: selector='app-sidebar-input' |
| L15 | src/app/shared/ui/sidebar/sidebar.service.ts | 7-32 | SidebarService: state/isMobile/openMobile signals, toggle/setState methods |

## Shadcn Baseline
- 基于 Radix UI
- 主要组件: SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger
- API 风格: 使用 className (Angular 中用 class)
- 使用 CSS 变量控制宽度

## Target API (After Rewrite)
1. selector 迁移: app-sidebar-* -> argusx-sidebar-*
2. 保留所有现有输入输出 (无冲突)
3. 保持 SidebarService 用于状态管理
4. 对齐 data-slot 属性
