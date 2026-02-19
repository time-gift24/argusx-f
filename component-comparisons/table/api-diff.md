# table API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| selector (container) | N/A | appTableContainer | N/A | argusxTableContainer | no | extend-argusx | default plain | L1 |
| selector (table) | z-table | appTable | N/A | argusxTable | no | extend-argusx | default plain | L1 |
| selector (header) | z-table-header | appTableHeader | N/A | argusxTableHeader | no | extend-argusx | default plain | L1 |
| selector (body) | z-table-body | appTableBody | N/A | argusxTableBody | no | extend-argusx | default plain | L1 |
| selector (footer) | z-table-footer | appTableFooter | N/A | argusxTableFooter | no | extend-argusx | default plain | L1 |
| selector (row) | z-table-row | appTableRow | N/A | argusxTableRow | no | extend-argusx | default plain | L1 |
| selector (head) | z-table-head | appTableHead | N/A | argusxTableHead | no | extend-argusx | default plain | L1 |
| selector (cell) | z-table-cell | appTableCell | N/A | argusxTableCell | no | extend-argusx | default plain | L1 |
| selector (caption) | z-table-caption | appTableCaption | N/A | argusxTableCaption | no | extend-argusx | default plain | L1 |
| type variants | zType (default/striped/bordered) | N/A | N/A | argusxType (default/striped/bordered) | no | extend-argusx | default plain, striped/bordered optional | Z2 |
| size variants | zSize (default/compact/comfortable) | N/A | N/A | argusxSize (default/compact/comfortable) | no | extend-argusx | default plain | Z2 |
| data-slot | N/A | yes | yes | yes | no | extend-argusx | data-slot present | L1 |
| class input | class | class | N/A | class | no | extend-argusx | default plain | L1 |

## Conflict Decisions (Must Adopt shadcn)
- No conflicts: Both shadcn and local use directive/element-based approach with data attributes. Zardui uses components but local already has directive implementation.

## Non-conflict Extensions (ArgusX Plain)
- [ ] type variants: Add argusxType input with values 'default', 'striped', 'bordered' for table element - extends shadcn path without breaking it
- [ ] size variants: Add argusxSize input with values 'default', 'compact', 'comfortable' for table element - extends shadcn path without breaking it
- [ ] Naming migration: appTable* -> argusxTable* prefix

## Missing APIs
- [ ] type/size variants: Zardui has this, local doesn't - will add as ArgusX extension

## Behavior Mismatches
- None: Local directive approach is compatible with shadcn pattern

## Final Target API
- selectors:
  - `[argusxTableContainer]` - table container wrapper
  - `table[argusxTable]` - main table element
  - `thead[argusxTableHeader]` - table header
  - `tbody[argusxTableBody]` - table body
  - `tfoot[argusxTableFooter]` - table footer
  - `tr[argusxTableRow]` - table row
  - `th[argusxTableHead]` - table head cell
  - `td[argusxTableCell]` - table cell
  - `caption[argusxTableCaption]` - table caption
- inputs:
  - `argusxType: 'default' | 'striped' | 'bordered'` (table only)
  - `argusxSize: 'default' | 'compact' | 'comfortable'` (table only)
  - `class: string` (all)
- outputs: none
- data attributes:
  - `data-slot="table-container"`, `"table"`, `"table-header"`, `"table-body"`, `"table-footer"`, `"table-row"`, `"table-head"`, `"table-cell"`, `"table-caption"`
- accessibility contract:
  - Semantic table elements (thead, tbody, tfoot, tr, th, td, caption)
  - Standard ARIA support through native elements
- plain style defaults:
  - Default variant: no borders except bottom border on rows, subtle hover
  - No heavy shadows, gradients, or decorations in default state
  - Uses theme CSS variables (text-muted-foreground, bg-muted)
