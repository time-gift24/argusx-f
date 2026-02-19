# scroll-area API Diff

## API Matrix

| API | Local (app-scroll-area) | Shadcn (scroll-area) | Target (argusx-scroll-area) | Decision |
|-----|------------------------|----------------------|----------------------------|----------|
| selector | app-scroll-area | - | argusx-scroll-area | rename (argusx prefix) |
| class input | class | className | class | no conflict (Angular style) |
| orientation | orientation | - | orientation | extend (ArgusX) |
| scrollbarVisible | scrollbarVisible | - | scrollbarVisible | extend (ArgusX) |
| scrollChange | scrollChange | - | scrollChange | extend (ArgusX) |
| scrollBottom | scrollBottom | - | scrollBottom | extend (ArgusX) |

## Conflict Decisions
- 无冲突项：shadcn scroll-area API 非常简单，只有 className，本地扩展了多个 API

## Non-conflict Extensions
| API | Type | Description | Plain Style |
|-----|------|-------------|-------------|
| orientation | Input<'vertical' \| 'horizontal' \| 'both'> | 滚动方向 | 默认 'both' |
| scrollbarVisible | Input<boolean> | 是否显示自定义滚动条 | 默认 true |
| scrollChange | Output<{top: number, left: number}> | 滚动位置变化事件 | - |
| scrollBottom | Output<void> | 滚动到底部事件 | - |

## Missing APIs
- 无 (本地已有完整实现)

## Behavior Mismatches
- 无

## Final Target API
```typescript
@Component({
  selector: 'argusx-scroll-area',
  ...
})
export class ScrollAreaComponent {
  readonly orientation = input<'vertical' | 'horizontal' | 'both'>('both');
  readonly class = input<string>('');
  readonly scrollbarVisible = input<boolean>(true);
  readonly scrollChange = output<{ top: number; left: number }>();
  readonly scrollBottom = output<void>();

  // Methods
  scrollToPosition(position: { top?: number; left?: number }): void
  scrollToTop(): void
  scrollToBottom(): void
}
```

## ScrollBar Component (Internal)
```typescript
@Component({
  selector: 'argusx-scroll-bar',
  ...
})
export class ScrollBarComponent {
  readonly orientation = input<'vertical' | 'horizontal' | 'both'>('vertical');
  readonly class = input<string>('');
  readonly scrollHeight = input<number>(0);
  readonly clientHeight = input<number>(0);
  readonly scrollTop = input<number>(0);
  readonly scrollWidth = input<number>(0);
  readonly clientWidth = input<number>(0);
  readonly scrollLeft = input<number>(0);
  readonly scrollTo = output<{ top?: number; left?: number }>();
}
```
