# Component Name Mapping

Use this mapping when `component`, `zarduiComponent`, and shadcn item names differ.

## High-confidence mappings

| local (`src/app/shared/ui`) | zardui (`/tmp/zardui/.../components`) | shadcn item / preview slug | notes |
| --- | --- | --- | --- |
| `dropdown-menu` | `dropdown` | `dropdown-menu` | same behavior family |
| `separator` | `divider` | `separator` | visual separator component |
| `progress` | `progress-bar` | `progress` | progress indicator |
| `radio-group` | `radio` | `radio-group` | grouped radio selection |
| `spinner` | `loader` | `spinner` (if available) | loading indicator naming differs |
| `context-menu` | `menu` | `context-menu` | right-click/open menu behavior |
| `menubar` | `menu` | `menubar` | top-level menu bar |

## Medium-confidence mappings (verify by source)

| local | candidate zardui | candidate shadcn | verify |
| --- | --- | --- | --- |
| `drawer` | `sheet` | `drawer` or `sheet` | check side/overlay interaction model |
| `native-select` | `select` | `select` | native vs custom popup behavior |
| `field` | `form` | `form` patterns | check validation API ownership |

## No direct zardui counterpart by default

Treat as `N/A` unless you find an equivalent in zardui source:
- `chart`
- `hover-card`
- `input-otp`
- `scroll-area`
- `markdown`
- `liquid-glass`
- `typography`
- `sidebar`

## Mapping rules

1. Prefer behavior and API shape over folder names.
2. Keep `N/A` when no true equivalent exists.
3. Record mapping rationale inside `component-comparisons/{component}/source-understanding.md`.
