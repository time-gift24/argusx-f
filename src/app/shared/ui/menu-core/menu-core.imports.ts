import { ArgusxContextMenuDirective } from './context-menu.directive';
import { ArgusxMenuContentDirective } from './menu-content.directive';
import { ArgusxMenuItemDirective } from './menu-item.directive';
import { ArgusxMenuLabelComponent } from './menu-label.component';
import { ArgusxMenuShortcutComponent } from './menu-shortcut.component';
import { ArgusxMenuDirective } from './menu.directive';

export const ArgusxMenuCoreImports = [
  ArgusxContextMenuDirective,
  ArgusxMenuContentDirective,
  ArgusxMenuItemDirective,
  ArgusxMenuDirective,
  ArgusxMenuLabelComponent,
  ArgusxMenuShortcutComponent,
] as const;
