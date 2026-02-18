---
name: ui-component-capability-analyzer
description: 对本地 Angular UI 组件与 shadcn (React)、zardui 实现做逐组件、源码级能力差距分析，输出每个 component 的量化评分、Top 3 实现差距和关键代码证据片段。用于制定组件补齐优先级与改造任务拆解。
---

# UI 组件能力分析器（源码级）

按组件逐个分析实现差距，禁止只给 preview 层面的宽泛结论。

## 强制交付物

为每个待分析组件都产出单独文档：`component-comparisons/{component}/capability-analysis.md`。

每个文档必须同时满足以下条件：
1. 包含三方实现量化评分表（本地 / shadcn / zardui）。
2. 明确列出 `3 个` 代码级实现差距（Gap-1 ~ Gap-3），每个差距都绑定源码证据。
3. 收录关键代码片段（本地、shadcn、zardui 各至少 2 段），且标注文件路径与行号。
4. 给出可直接执行的本地改造建议（改哪些文件、补哪些 API、如何验收）。

不要把分析写到 `previews/{component}`；该目录只用于预览观察，不是源码差距报告目录。

## 数据源与优先级

按下列顺序取证：

1. 本地组件源码（必须）
- `src/app/shared/ui/{component}/**/*.ts`
- `src/app/shared/ui/{component}/**/*.html`
- `src/app/shared/ui/{component}/**/*.css`

2. shadcn 源码（必须）
- 通过 MCP 获取：`mcp__shadcn__search_items_in_registries` + `mcp__shadcn__view_items_in_registries`
- 组件 ID 统一为 `@shadcn/{component}`，找不到时先做 fuzzy search 再确认最接近实现

3. zardui 源码（优先真实源码，文档仅作补充）
- 首选：`/tmp/zardui/libs/zard/src/lib/shared/components/{component}/`
- 补充：`/tmp/zardui/apps/web/public/components/{component}/doc/` 和 `demo/`
- 快照：`/tmp/zardui/apps/web/public/r/{component}.json`

如果 `/tmp/zardui` 不存在，先执行：

```bash
git clone --depth 1 https://github.com/zard-ui/zardui.git /tmp/zardui
```

## 分析流程

### Step 1: 生成待分析组件列表

执行以下动作：
1. 从 `src/app/shared/ui/` 枚举本地组件目录。
2. 读取 `src/app/preview/preview-layout.component.ts` 中 `manuallyReviewed: true` 的组件，加入排除名单。
3. 去重并排序，得到本轮组件列表。

### Step 2: 建立三方组件映射

对每个组件建立 `local -> shadcn -> zardui` 映射。命名不一致时显式记录映射依据。例如：
- `dropdown-menu -> dropdown-menu -> dropdown`
- `separator -> separator -> divider`
- `progress -> progress -> progress-bar`
- `radio-group -> radio-group -> radio`

优先参考：`references/component-name-mapping.md`。

### Step 3: 提取源码证据

对每个组件至少采集 6 条证据（每个实现至少 2 条）。

取证要求：
1. 每条证据必须有 `EVIDENCE_ID`。
2. 每条证据必须包含文件路径和行号范围。
3. 每条证据必须附带 8-25 行关键代码片段。
4. 禁止只写“从 demo 推断”；若无源码则标注“证据缺失”并降低置信度。

建议使用以下命令拿到带行号片段：

```bash
nl -ba <file-path> | sed -n '<start>,<end>p'
```

### Step 4: 评分（量化）

使用 `references/report-template.md` 中的评分矩阵。

评分规则：
1. 使用 0-5 分整数或 0.5 步进。
2. 按权重计算每个实现的加权总分。
3. 每个维度分数必须引用证据 ID，不能只给主观结论。

### Step 5: 提炼 3 个实现差距（Top 3）

每个组件必须固定输出 `3 个` 差距，按“业务影响高 + 实施可落地”排序：
1. Gap 标题（明确缺少什么能力）。
2. 三方当前实现对比（引用三方证据）。
3. 差距影响（功能、可访问性、性能、维护成本）。
4. 本地改造建议（具体文件、API、验收点）。

### Step 6: 输出文档

按 `references/report-template.md` 的章节顺序输出。

额外要求：
1. 每个差距建议后附“最小改动路径”（先做哪一步）。
2. 在文末输出“改造任务清单（可逐条执行）”。
3. 如果某一方实现不存在，显式写 `N/A` 并说明原因，不要省略列。

## 质量门槛

提交前逐项自检：
1. 是否每个组件都落盘到了 `component-comparisons/{component}/capability-analysis.md`。
2. 是否每个组件都恰好 3 个差距（不是 2 个，也不是泛泛很多条）。
3. 是否每个维度分数都能追溯到源码证据 ID。
4. 是否包含本地/shadcn/zardui 三方关键片段（每方至少 2 段）。
5. 是否避免“推断式结论”。
