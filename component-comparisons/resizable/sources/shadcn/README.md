# resizable - shadcn sources

## resizable-demo.json
```json
[
  {
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "resizable-demo",
    "registryDependencies": [
      "resizable"
    ],
    "files": [
      {
        "path": "registry/new-york-v4/examples/resizable-demo.tsx",
        "content": "import {\n  ResizableHandle,\n  ResizablePanel,\n  ResizablePanelGroup,\n} from \"@/registry/new-york-v4/ui/resizable\"\n\nexport default function ResizableDemo() {\n  return (\n    <ResizablePanelGroup\n      orientation=\"horizontal\"\n      className=\"max-w-md rounded-lg border md:min-w-[450px]\"\n    >\n      <ResizablePanel defaultSize=\"50%\">\n        <div className=\"flex h-[200px] items-center justify-center p-6\">\n          <span className=\"font-semibold\">One</span>\n        </div>\n      </ResizablePanel>\n      <ResizableHandle />\n      <ResizablePanel defaultSize=\"50%\">\n        <ResizablePanelGroup orientation=\"vertical\">\n          <ResizablePanel defaultSize=\"25%\">\n            <div className=\"flex h-full items-center justify-center p-6\">\n              <span className=\"font-semibold\">Two</span>\n            </div>\n          </ResizablePanel>\n          <ResizableHandle />\n          <ResizablePanel defaultSize=\"75%\">\n            <div className=\"flex h-full items-center justify-center p-6\">\n              <span className=\"font-semibold\">Three</span>\n            </div>\n          </ResizablePanel>\n        </ResizablePanelGroup>\n      </ResizablePanel>\n    </ResizablePanelGroup>\n  )\n}\n",
        "type": "registry:example"
      }
    ],
    "type": "registry:example"
  }
]
```

## resizable-demo.tsx
```tsx
import {\n  ResizableHandle,\n  ResizablePanel,\n  ResizablePanelGroup,\n} from "@/registry/new-york-v4/ui/resizable"\n\nexport default function ResizableDemo() {\n  return (\n    <ResizablePanelGroup\n      orientation="horizontal"\n      className="max-w-md rounded-lg border md:min-w-[450px]"\n    >\n      <ResizablePanel defaultSize="50%">\n        <div className="flex h-[200px] items-center justify-center p-6">\n          <span className="font-semibold">One</span>\n        </div>\n      </ResizablePanel>\n      <ResizableHandle />\n      <ResizablePanel defaultSize="50%">\n        <ResizablePanelGroup orientation="vertical">\n          <ResizablePanel defaultSize="25%">\n            <div className="flex h-full items-center justify-center p-6">\n              <span className="font-semibold">Two</span>\n            </div>\n          </ResizablePanel>\n          <ResizableHandle />\n          <ResizablePanel defaultSize="75%">\n            <div className="flex h-full items-center justify-center p-6">\n              <span className="font-semibold">Three</span>\n            </div>\n          </ResizablePanel>\n        </ResizablePanelGroup>\n      </ResizablePanel>\n    </ResizablePanelGroup>\n  )\n}\n```

## resizable.json
```json
[
  {
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "resizable",
    "dependencies": [
      "react-resizable-panels@^4"
    ],
    "files": [
      {
        "path": "registry/new-york-v4/ui/resizable.tsx",
        "content": "\"use client\"\n\nimport { GripVerticalIcon } from \"lucide-react\"\nimport * as ResizablePrimitive from \"react-resizable-panels\"\n\nimport { cn } from \"@/lib/utils\"\n\nfunction ResizablePanelGroup({\n  className,\n  ...props\n}: ResizablePrimitive.GroupProps) {\n  return (\n    <ResizablePrimitive.Group\n      data-slot=\"resizable-panel-group\"\n      className={cn(\n        \"flex h-full w-full aria-[orientation=vertical]:flex-col\",\n        className\n      )}\n      {...props}\n    />\n  )\n}\n\nfunction ResizablePanel({ ...props }: ResizablePrimitive.PanelProps) {\n  return <ResizablePrimitive.Panel data-slot=\"resizable-panel\" {...props} />\n}\n\nfunction ResizableHandle({\n  withHandle,\n  className,\n  ...props\n}: ResizablePrimitive.SeparatorProps & {\n  withHandle?: boolean\n}) {\n  return (\n    <ResizablePrimitive.Separator\n      data-slot=\"resizable-handle\"\n      className={cn(\n        \"bg-border focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90\",\n        className\n      )}\n      {...props}\n    >\n      {withHandle && (\n        <div className=\"bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border\">\n          <GripVerticalIcon className=\"size-2.5\" />\n        </div>\n      )}\n    </ResizablePrimitive.Separator>\n  )\n}\n\nexport { ResizableHandle, ResizablePanel, ResizablePanelGroup }\n",
        "type": "registry:ui"
      }
    ],
    "type": "registry:ui"
  }
]
```

## resizable.tsx
```tsx
"use client"\n\nimport { GripVerticalIcon } from "lucide-react"\nimport * as ResizablePrimitive from "react-resizable-panels"\n\nimport { cn } from "@/lib/utils"\n\nfunction ResizablePanelGroup({\n  className,\n  ...props\n}: ResizablePrimitive.GroupProps) {\n  return (\n    <ResizablePrimitive.Group\n      data-slot="resizable-panel-group"\n      className={cn(\n        "flex h-full w-full aria-[orientation=vertical]:flex-col",\n        className\n      )}\n      {...props}\n    />\n  )\n}\n\nfunction ResizablePanel({ ...props }: ResizablePrimitive.PanelProps) {\n  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />\n}\n\nfunction ResizableHandle({\n  withHandle,\n  className,\n  ...props\n}: ResizablePrimitive.SeparatorProps & {\n  withHandle?: boolean\n}) {\n  return (\n    <ResizablePrimitive.Separator\n      data-slot="resizable-handle"\n      className={cn(\n        "bg-border focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90",\n        className\n      )}\n      {...props}\n    >\n      {withHandle && (\n        <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border">\n          <GripVerticalIcon className="size-2.5" />\n        </div>\n      )}\n    </ResizablePrimitive.Separator>\n  )\n}\n\nexport { ResizableHandle, ResizablePanel, ResizablePanelGroup }\n```

