# toast - shadcn sources

## sonner-demo.json
```json
[
  {
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "sonner-demo",
    "registryDependencies": [
      "sonner"
    ],
    "files": [
      {
        "path": "registry/new-york-v4/examples/sonner-demo.tsx",
        "content": "\"use client\"\n\nimport { toast } from \"sonner\"\n\nimport { Button } from \"@/registry/new-york-v4/ui/button\"\n\nexport default function SonnerDemo() {\n  return (\n    <Button\n      variant=\"outline\"\n      onClick={() =>\n        toast(\"Event has been created\", {\n          description: \"Sunday, December 03, 2023 at 9:00 AM\",\n          action: {\n            label: \"Undo\",\n            onClick: () => console.log(\"Undo\"),\n          },\n        })\n      }\n    >\n      Show Toast\n    </Button>\n  )\n}\n",
        "type": "registry:example"
      }
    ],
    "type": "registry:example"
  }
]
```

## sonner-demo.tsx
```tsx
"use client"\n\nimport { toast } from "sonner"\n\nimport { Button } from "@/registry/new-york-v4/ui/button"\n\nexport default function SonnerDemo() {\n  return (\n    <Button\n      variant="outline"\n      onClick={() =>\n        toast("Event has been created", {\n          description: "Sunday, December 03, 2023 at 9:00 AM",\n          action: {\n            label: "Undo",\n            onClick: () => console.log("Undo"),\n          },\n        })\n      }\n    >\n      Show Toast\n    </Button>\n  )\n}\n```

## sonner.json
```json
[
  {
    "$schema": "https://ui.shadcn.com/schema/registry-item.json",
    "name": "sonner",
    "dependencies": [
      "sonner",
      "next-themes"
    ],
    "files": [
      {
        "path": "registry/new-york-v4/ui/sonner.tsx",
        "content": "\"use client\"\n\nimport {\n  CircleCheckIcon,\n  InfoIcon,\n  Loader2Icon,\n  OctagonXIcon,\n  TriangleAlertIcon,\n} from \"lucide-react\"\nimport { useTheme } from \"next-themes\"\nimport { Toaster as Sonner, type ToasterProps } from \"sonner\"\n\nconst Toaster = ({ ...props }: ToasterProps) => {\n  const { theme = \"system\" } = useTheme()\n\n  return (\n    <Sonner\n      theme={theme as ToasterProps[\"theme\"]}\n      className=\"toaster group\"\n      icons={{\n        success: <CircleCheckIcon className=\"size-4\" />,\n        info: <InfoIcon className=\"size-4\" />,\n        warning: <TriangleAlertIcon className=\"size-4\" />,\n        error: <OctagonXIcon className=\"size-4\" />,\n        loading: <Loader2Icon className=\"size-4 animate-spin\" />,\n      }}\n      style={\n        {\n          \"--normal-bg\": \"var(--popover)\",\n          \"--normal-text\": \"var(--popover-foreground)\",\n          \"--normal-border\": \"var(--border)\",\n          \"--border-radius\": \"var(--radius)\",\n        } as React.CSSProperties\n      }\n      {...props}\n    />\n  )\n}\n\nexport { Toaster }\n",
        "type": "registry:ui"
      }
    ],
    "type": "registry:ui"
  }
]
```

## sonner.tsx
```tsx
"use client"\n\nimport {\n  CircleCheckIcon,\n  InfoIcon,\n  Loader2Icon,\n  OctagonXIcon,\n  TriangleAlertIcon,\n} from "lucide-react"\nimport { useTheme } from "next-themes"\nimport { Toaster as Sonner, type ToasterProps } from "sonner"\n\nconst Toaster = ({ ...props }: ToasterProps) => {\n  const { theme = "system" } = useTheme()\n\n  return (\n    <Sonner\n      theme={theme as ToasterProps["theme"]}\n      className="toaster group"\n      icons={{\n        success: <CircleCheckIcon className="size-4" />,\n        info: <InfoIcon className="size-4" />,\n        warning: <TriangleAlertIcon className="size-4" />,\n        error: <OctagonXIcon className="size-4" />,\n        loading: <Loader2Icon className="size-4 animate-spin" />,\n      }}\n      style={\n        {\n          "--normal-bg": "var(--popover)",\n          "--normal-text": "var(--popover-foreground)",\n          "--normal-border": "var(--border)",\n          "--border-radius": "var(--radius)",\n        } as React.CSSProperties\n      }\n      {...props}\n    />\n  )\n}\n\nexport { Toaster }\n```

