import { Injectable } from '@angular/core';

import type { ArgusxMenuDirective } from './menu.directive';

@Injectable({
  providedIn: 'root',
})
export class ArgusxMenuManagerService {
  private activeHoverMenu: ArgusxMenuDirective | null = null;

  registerHoverMenu(menu: ArgusxMenuDirective): void {
    if (this.activeHoverMenu && this.activeHoverMenu !== menu) {
      this.activeHoverMenu.close();
    }
    this.activeHoverMenu = menu;
  }

  unregisterHoverMenu(menu: ArgusxMenuDirective): void {
    if (this.activeHoverMenu === menu) {
      this.activeHoverMenu = null;
    }
  }

  closeActiveMenu(): void {
    if (this.activeHoverMenu) {
      this.activeHoverMenu.close();
      this.activeHoverMenu = null;
    }
  }
}
