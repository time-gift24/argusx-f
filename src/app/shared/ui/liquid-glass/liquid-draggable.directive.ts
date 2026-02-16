import {
  Directive,
  inject,
  output,
  signal,
} from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Directive({
  selector: '[appLiquidDraggable]',
  standalone: true,
  providers: [{ provide: CdkDrag, useExisting: LiquidDraggableDirective }],
})
export class LiquidDraggableDirective extends CdkDrag {
  readonly dragStart = output<void>();
  readonly dragEnd = output<void>();

  readonly isDragging = signal(false);

  constructor() {
    super();

    this.dragStarted.subscribe(() => {
      this.isDragging.set(true);
      this.dragStart.emit();
    });

    this.dragEnded.subscribe(() => {
      this.isDragging.set(false);
      this.dragEnd.emit();
    });
  }
}
