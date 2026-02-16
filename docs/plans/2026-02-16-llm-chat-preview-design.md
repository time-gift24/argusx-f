# LLM Chat Preview 设计文档

> Date: 2026-02-16  
> Scope: `/preview/llm-chat` 原型页（仅 preview，不接业务后端）

## 1. 背景与目标

基于现有 Angular 组件体系（`tabs`、`liquid-glass`、`context-menu`、`input-group` 等）设计一个 LLM 对话框原型：

- 会话 tab 位于对话框正上方
- 每个 session 有不同背景色，整体视觉为 liquid-glass
- 当前选中 session 使用实线边框高亮
- AI streaming 用左侧图标表示（不占用实线高亮）
- 每个 session 具备保存后续 streaming-markdown 的数据能力（本期先不实现 streaming markdown）

## 2. 明确范围

### 本期范围（In Scope）

- 新增 preview 页面：`/preview/llm-chat`
- Session 管理：新建、切换、关闭（最多 5 个）
- Session 右键菜单：改名、改色（预设色板）
- 会话状态展示：`streaming`、`error`、`ended(通知)`
- 每个 session 内存态保存 `messages[]`
- 发送后本地 echo 回复（丰富回显内容）

### 非本期范围（Out of Scope）

- 服务端持久化
- 页面刷新后恢复会话
- 真实模型接口
- streaming markdown 增量渲染

## 3. 方案选择

### 备选方案

1. 单组件原型（最快，但后续扩展差）
2. 容器 + 轻拆分子组件（平衡交付速度与可扩展性）
3. 预演业务化 store 架构（当前偏重）

### 最终选择

采用 **方案 2（容器 + 轻拆分子组件）**。

## 4. 架构与组件边界

### 路由接入

- 在 `app.routes.ts` 增加 `preview/llm-chat` 子路由
- 在 `preview-layout.component.ts` 增加导航项

### 组件划分

- `llm-chat-preview.component.ts`（容器）
  - 持有全部状态（signals）
  - 负责 session 操作、消息追加、状态更新
- `llm-chat-session-tabs.component.ts`
  - 顶部 session tabs
  - 新建/切换/关闭、右键改名改色、状态标识
- `llm-chat-message-list.component.ts`
  - 消息列表渲染（结构为未来 markdown streaming 预留）
- `llm-chat-composer.component.ts`
  - 输入框 + 发送按钮

### 复用现有组件

- Tabs：`app-tabs` / `app-tabs-list` / `app-tabs-trigger`
- Liquid Glass：`app-liquid-glass`
- Context Menu：`app-context-menu`
- Composer：`app-input-group` + `app-input-group-textarea` + `argus-button`

## 5. 数据模型设计（内存态）

```ts
type SessionStatus = 'idle' | 'streaming' | 'error' | 'ended';
type SessionColor =
  | 'violet'
  | 'amber'
  | 'sky'
  | 'emerald'
  | 'rose'
  | 'slate'
  | 'cyan'
  | 'lime';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  contentMarkdown: string;
  createdAt: number;
  status?: 'complete' | 'streaming' | 'error';
}

interface ChatSession {
  id: string;
  title: string;
  color: SessionColor;
  status: SessionStatus;
  statusUpdatedAt: number;
  messages: ChatMessage[];
}
```

### 页面状态（signals）

- `sessions: Signal<ChatSession[]>`
- `activeSessionId: Signal<string>`
- `composerValue: Signal<string>`
- `renameDraft`（改名临时态）

### 关键 computed

- `activeSession`
- `canCreateSession`（`sessions.length < 5`）
- `sendDisabled`

## 6. 状态机与规则

### 状态集合

- `streaming`
- `error`
- `ended`（结束通知）

### 冲突规则

同一 session 的状态冲突采用：**后发生覆盖前一个**。  
统一入口：`setSessionStatus(sessionId, status, at=Date.now())`，按时间戳覆盖。

## 7. 交互与视觉规范

### Session Tab 视觉

- 基础：liquid-glass 半透明效果
- 背景色：由 session color preset 决定
- 选中：实线边框高亮（solid border）
- streaming：左侧图标
- ended：小徽标“已结束” + 红点
- error：异常图标/错误色标识

### 右键菜单

- `Rename`
- `Change Color`（8 色预设）
- `Close Session`

约束：
- 最后一个 session 不允许关闭
- session 数量上限 5

### Composer 与消息区

- Enter 发送，Shift+Enter 换行
- 空输入不可发送
- 发送后清空输入并保持焦点
- 消息按 `messages[]` 渲染

## 8. Echo 行为（preview 内）

发送后流程：

1. 追加 user message
2. 追加 assistant echo message（丰富内容：确认 + 结构化复述 + 下一步建议）
3. 更新 session 状态（可用示例路径：`streaming -> ended`）

说明：本期仅本地模拟，不调用后端。

## 9. 错误处理与边界

- 新建超限：阻止并提示
- 空消息：阻止发送
- 改名空值：回退原名
- 关闭当前 session：自动切换相邻 session
- 永远保留至少 1 个 session

## 10. 验收标准

- `/preview/llm-chat` 可进入，具备完整交互
- 会话满足：新建/切换/关闭、最多 5 个、右键改名改色
- 状态满足：streaming 图标、ended 徽标+红点、error 标识
- active session 实线高亮
- 每个 session 独立保存 `messages[]`（内存）
- 发送生成 richer echo 回复
- streaming markdown 暂不实现，但结构已预留
