import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TooltipService {
  readonly delayDuration = signal<number>(300);

  setDelayDuration(duration: number): void {
    this.delayDuration.set(duration);
  }
}
