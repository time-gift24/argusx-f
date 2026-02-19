# resizable Source Understanding

## Mapping
- local: `resizable`
- zardui: `resizable`
- shadcn: `resizable`
- rationale: All three libraries have the same component concept for panel resizing

## ZardUI Evidence

| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | /Users/wanyaozhong/projects/zardui/src/app/shared/components/resizable/resizable.component.ts | 1-313 | Main component with layout, lazy loading, resize events |
| Z2 | /Users/wanyaozhong/projects/zardui/src/app/shared/components/resizable/resizable-panel.component.ts | 1-51 | Panel component with defaultSize, min, max, collapsible |
| Z3 | /Users/wanyaozhong/projects/zardui/src/app/shared/components/resizable/resizable-handle.component.ts | 1-242 | Handle component with withHandle, disabled, keyboard support |
| Z4 | /Users/wanyaozhong/projects/zardui/src/app/shared/components/resizable/resizable.variants.ts | 1-65 | CVA variants for styling |

## Shadcn Evidence (via MCP)

| id | source | API | note |
| --- | --- | --- | --- |
| S1 | mcp__shadcn__get_item_examples_from_registries | ResizablePanelGroup, ResizablePanel, ResizableHandle | 3 components with orientation, defaultSize, withHandle |
| S2 | shadcn registry | resizable | Uses react-resizable-panels as underlying lib |

## Usage Evidence (Doc + Demo)
- shadcn: https://ui.shadcn.com/preview/radix/resizable-example
- zardui demo: Not available in /tmp/zardui/apps/web/public/components/resizable

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | src/app/shared/ui/resizable/resizable.component.ts | 1-635 | 3 components: ResizablePanelGroup, ResizablePanel, ResizableHandle |
