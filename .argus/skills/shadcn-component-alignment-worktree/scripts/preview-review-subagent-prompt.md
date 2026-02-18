# Preview Review Subagent Prompt Template

Use this prompt as the subagent payload for one component task.

## Prompt

你现在是子 agent，只处理一个组件，禁止处理其他组件。

输入文件：`{{inputFile}}`  
输出文件：`{{outputFile}}`

执行要求：
1. 读取输入 JSON，并仅处理 `component` 指定的组件。
2. 首先阅读 `baselineDir`（`previews/shadcn/{component}`）中的基线资料：
   - `*.png` 截图
   - `capture.scenario.json`（若存在）
   - `analysis.md` / `capability-analysis.md`（若存在）
3. 打开并比对线上预览 `onlinePreviewUrl`，确认本地基线截图没有漂移；若发现漂移，先更新基线证据再继续。
4. 修改后打开本地预览 `localPreviewUrl`，逐状态对比基线截图与线上预览，直到 1:1 像素级一致。
5. 所有实现与验证工作只能在 `worktreePath` 下进行。
6. 视觉与交互都必须验证：
   - `checks.visualPass === true`
   - `checks.interactionPass === true`
7. 成功时提交代码并返回 `commitSha`；失败时返回可诊断错误与产物路径。
8. 最终必须把结果 JSON 写入 `{{outputFile}}`（不是 stdout）。
9. 若你没有完成 preview 1:1 像素级复刻，禁止返回 `status=success`。

主进程会质问（硬门禁）：
- 你为什么在“测试通过”后没有提交像素级复刻证据？
- 你的 `visualDiffJson` 在哪里？其结果是否通过？
- 你的 `interactionResultsJson` 在哪里？其结果是否通过？
- 如果缺任一证据，主进程会直接判定任务失败。

输出 JSON 契约（严格）：

成功：
```json
{
  "component": "<component>",
  "status": "success",
  "branch": "codex/review-<component>",
  "worktreePath": "<absolute path>",
  "commitSha": "<git sha>",
  "checks": {
    "visualPass": true,
    "interactionPass": true
  },
  "artifacts": {
    "visualDiffJson": "<required path>",
    "interactionResultsJson": "<required path>",
    "runStateJson": "<optional path>"
  }
}
```

失败：
```json
{
  "component": "<component>",
  "status": "failed",
  "branch": "codex/review-<component>",
  "worktreePath": "<absolute path>",
  "error": "<error message>",
  "artifacts": {
    "visualDiffJson": "<optional path>",
    "interactionResultsJson": "<optional path>",
    "runStateJson": "<optional path>"
  }
}
```
