import {
  Directive,
  ElementRef,
  output,
  signal,
  effect,
  inject,
  NgZone,
  HostListener,
} from '@angular/core';

export interface MousePosition {
  x: number;
  y: number;
}

@Directive({
  selector: '[appLiquidMouse]',
  standalone: true,
})
export class LiquidMouseDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly ngZone = inject(NgZone);

  readonly mouseMove = output<MousePosition>();
  readonly mouseEnter = output<void>();
  readonly mouseLeave = output<void>();

  private readonly _state = signal<MousePosition & { isActive: boolean }>({
    x: 0,
    y: 0,
    isActive: false,
  });

  readonly state = this._state.asReadonly();

  constructor() {
    // 使用 effect 更新 CSS 变量（不触发 Angular 变更检测）
    effect(() => {
      const { x, y } = this._state();
      this.ngZone.runOutsideAngular(() => {
        const el = this.elementRef.nativeElement;
        el.style.setProperty('--liquid-mouse-x', `${x}px`);
        el.style.setProperty('--liquid-mouse-y', `${y}px`);
      });
    });
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.mouseEnter.emit();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this._state.update((s) => ({ ...s, isActive: false }));
    this.mouseLeave.emit();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.ngZone.runOutsideAngular(() => {
      const rect = this.elementRef.nativeElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      this._state.set({ x, y, isActive: true });
      this.mouseMove.emit({ x, y });
    });
  }
}
