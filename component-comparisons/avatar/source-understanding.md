# Avatar Source Understanding

## Mapping
- local: `avatar`
- zardui: `avatar` (zardui source not available locally)
- shadcn: `avatar`
- rationale: shadcn API alignment with naming migration to argusx- prefix

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | N/A | N/A | zardui source not available in /tmp/zardui |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | mcp shadcn avatar-demo | 1-30 | Basic usage with AvatarImage and AvatarFallback |
| U2 | mcp shadcn avatar-demo | 15-30 | Avatar group with stacked avatars |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | src/app/shared/ui/avatar/avatar.component.ts | 1-381 | Original app-avatar selector with appAvatarImage/appAvatarFallback directives |
| L2 | src/app/preview/avatar-preview.component.ts | 1-141 | Preview using app-avatar components |

## Shadcn Evidence
| id | source | note |
| --- | --- | --- |
| S1 | @shadcn/avatar | registry:ui component |
| S2 | @shadcn/avatar-demo | Example with Avatar, AvatarImage, AvatarFallback |
| S3 | https://ui.shadcn.com/preview/radix/avatar | Official shadcn preview |
