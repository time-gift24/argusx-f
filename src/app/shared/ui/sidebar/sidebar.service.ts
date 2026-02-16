import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  readonly state = signal<'expanded' | 'collapsed'>('expanded');
  readonly isMobile = signal<boolean>(false);
  readonly openMobile = signal<boolean>(false);

  readonly width = '16rem';
  readonly widthIcon = '3rem';

  toggle(): void {
    if (this.isMobile()) {
      this.openMobile.update((v) => !v);
    } else {
      this.state.update((s) => (s === 'expanded' ? 'collapsed' : 'expanded'));
    }
  }

  setState(state: 'expanded' | 'collapsed'): void {
    this.state.set(state);
  }

  setOpenMobile(open: boolean): void {
    this.openMobile.set(open);
  }

  setIsMobile(isMobile: boolean): void {
    this.isMobile.set(isMobile);
  }
}
