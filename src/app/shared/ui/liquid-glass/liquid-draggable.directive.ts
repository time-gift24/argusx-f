import {
  Directive,
  output,
  signal,
} from '@angular/core';
import { CdkDrag, CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';

@Directive({
  selector: '[appLiquidDraggable]',
  standalone: true,
})
export class LiquidDraggableDirective {
  readonly dragStart = output<void>();
  readonly dragEnd = output<void>();

  readonly isDragging = signal(false);

  constructor(private readonly cdkDrag: CdkDrag) {
    this.cdkDrag.started.subscribe(() => {
      this.isDragging.set(true);
      this.dragStart.emit();
    });

    this.cdkDrag.ended.subscribe(() => {
      this.isDragging.set(false);
      this.dragEnd.emit();
    });
  }
}
