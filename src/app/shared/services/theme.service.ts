import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly DARK_CLASS = 'dark';
  private readonly CHECK_INTERVAL = 60_000; // 1 minute
  private intervalId: ReturnType<typeof setInterval> | null = null;

  readonly isDark = signal(this.calculateIsDark());

  constructor() {
    this.applyTheme();
    this.startAutoCheck();
  }

  private calculateIsDark(): boolean {
    const hour = new Date().getHours();
    return hour < 6 || hour >= 18;
  }

  private applyTheme(): void {
    const shouldBeDark = this.calculateIsDark();
    this.isDark.set(shouldBeDark);
    this.updateHtmlClass(shouldBeDark);
  }

  private startAutoCheck(): void {
    this.intervalId = setInterval(() => this.applyTheme(), this.CHECK_INTERVAL);
  }

  private updateHtmlClass(dark: boolean): void {
    document.documentElement.classList.toggle(this.DARK_CLASS, dark);
  }
}
