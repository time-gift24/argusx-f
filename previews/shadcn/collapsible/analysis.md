# collapsible 组件能力分析

## 功能完整性

### 本地
本地实现包含三个组件:
- `CollapsibleComponent`: 根容器,支持 `open` (双向绑定)、`disabled`、`defaultOpen` 输入,以及 `onOpenChange` 输出事件
- `CollapsibleTriggerComponent`: 触发器按钮,支持点击和键盘(空格/回车)切换
- `CollapsibleContentComponent`: 内容区域,使用 CSS `max-height` 实现展开/收起动画

功能较为完整,支持:
- 双向绑定控制展开状态
- 禁用状态
- 初始展开状态
- 状态变化事件回调
- 平滑动画过渡

### shadcn
shadcn 的 collapsible 基于 Radix UI 实现,仅提供 1 个文件。Radix UI 提供无样式的可访问性组件,shadcn 在此基础上添加了样式。功能相对基础。

### zardui
zardui 路径 `/tmp/zardui/apps/web/public/components/collapsible/` 不存在,无可用信息。

---

## 性能

### 本地
- 使用 Angular Signals (`model`、`computed`) 管理状态,变更检测高效
- `ChangeDetectionStrategy.OnPush` 策略,减少不必要的变更检测
- 使用 CSS `max-height` 动画,比 JavaScript 动画性能更好
- 动画使用 `200ms ease-out`,简单高效

### shadcn
基于 Radix UI,Radix 使用纯 CSS 和原生浏览器机制,性能优秀。

### zardui
无数据。

---

## 易用性

### 本地
- 提供完整的组件组合 (`CollapsibleComponent` + `Trigger` + `Content`)
- 支持双向绑定 `[(open)]`,使用直观
- 提供 `defaultOpen` 初始状态设置
- 完整的 JSDoc 文档和示例代码
- 导出 `CollapsibleComponents` 便于批量导入

### shadcn
需要结合 Radix UI 使用,需要安装 `@radix-ui/react-collapsible` 依赖。

### zardui
无数据。

---

## API 设计

### 本地
```typescript
// CollapsibleComponent
readonly open = model<boolean>(false);        // 双向绑定
readonly disabled = input<boolean>(false);   // 禁用状态
readonly defaultOpen = input<boolean>(false); // 默认展开
readonly onOpenChange = output<boolean>();    // 状态变化事件

// CollapsibleTriggerComponent
// 通过依赖注入获取父组件状态,无需直接输入

// CollapsibleContentComponent
readonly class = input<string>('');  // 自定义样式类
```

设计优点:
- 使用 `model()` 实现双向绑定,符合 Angular 18+ 最佳实践
- 通过 `CollapsibleRootToken` 依赖注入实现子组件通信,解耦良好
- 所有组件都是 Standalone,符合 Angular 20 规范

### shadcn
```typescript
<Collapsible open={open} onOpenChange={setOpen}>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Content</CollapsibleContent>
</Collapsible>
```
React 风格的 API 设计,直观简洁。

### zardui
无数据。

---

## 可访问性

### 本地
实现了完整的无障碍支持:
- `role="button"` 触发器语义正确
- `aria-expanded` 正确指示展开状态
- `aria-controls` 关联触发器和内容区域
- `aria-labelledby` 内容区域被触发器标记
- `tabindex` 管理焦点顺序,禁用时为 -1
- 键盘支持: 空格键和回车键触发切换
- `disabled` 状态正确处理
- `data-state` 和 `data-slot` 属性支持辅助技术

### shadcn
基于 Radix UI,Radix UI 本身提供完整的无障碍支持,包括:
- 正确的 ARIA 属性
- 键盘导航
- 焦点管理

### zardui
无数据。

---

## 建议

### 开发优先级
本地 collapsible 组件已经具备较高的完成度:

1. **已完成**: 基本功能实现、双向绑定、动画、可访问性
2. **可选改进**:
   - 动画优化:当前使用固定 `max-height: none`,对于长内容可能有性能问题,建议使用 `scrollHeight` 动态计算实际高度
   - 动画时长可配置化
   - 添加 `animation` 输入控制是否启用动画
   - 支持自定义动画曲线

### 结论
本地实现已达到生产就绪状态,可以直接使用。相对于 shadcn 的简单封装,本地实现在 Angular 生态中更加完善,提供了更完整的动画和可访问性支持。

---

## 对比总结

| 特性 | 本地 | shadcn | zardui |
|------|------|--------|--------|
| 双向绑定 | 支持 | 支持 | - |
| 动画 | CSS max-height | - | - |
| 可访问性 | 完整 | 完整(Radix) | - |
| Angular 适配 | 原生 | 需适配 | - |
| 状态管理 | Signals | React State | - |
