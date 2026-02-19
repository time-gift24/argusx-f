#!/usr/bin/env python3
"""Create per-component rewrite deliverable skeleton files."""

from __future__ import annotations

import argparse
from pathlib import Path
from textwrap import dedent


def build_templates(component: str, zardui_component: str, shadcn_item: str) -> dict[str, str]:
    source_understanding = dedent(
        f"""\
        # {component} Source Understanding

        ## Mapping
        - local: `{component}`
        - zardui: `{zardui_component}`
        - shadcn: `{shadcn_item}`
        - rationale:

        ## ZardUI Evidence
        | id | file | lines | note |
        | --- | --- | --- | --- |
        | Z1 |  |  |  |
        | Z2 |  |  |  |

        ## Usage Evidence (Doc + Demo)
        | id | file | lines | scenario |
        | --- | --- | --- | --- |
        | U1 |  |  |  |
        | U2 |  |  |  |

        ## Local Baseline Evidence
        | id | file | lines | current behavior |
        | --- | --- | --- | --- |
        | L1 |  |  |  |
        | L2 |  |  |  |
        """
    )

    api_diff = dedent(
        f"""\
        # {component} API Diff

        ## API Matrix
        | api | zardui | local (current) | shadcn | target (argusx) | evidence |
        | --- | --- | --- | --- | --- | --- |
        |  |  |  |  |  | Z1/L1/S1 |

        ## Missing APIs
        - [ ] API name: impact + source evidence

        ## Behavior Mismatches
        - [ ] API name: mismatch + expected behavior + source evidence

        ## Final Target API
        - selectors:
        - inputs:
        - outputs:
        - data attributes:
        - accessibility contract:
        """
    )

    rewrite_plan = dedent(
        f"""\
        # {component} Rewrite Plan

        ## Naming Migration (z -> argusx)
        - [ ] selector migration
        - [ ] input/output/type symbol migration
        - [ ] index export migration
        - [ ] compatibility alias (if needed)

        ## shadcn API Alignment
        - [ ] API surface alignment
        - [ ] behavior alignment
        - [ ] accessibility alignment

        ## File-level Plan
        1. `src/app/shared/ui/{component}/...`
        2. `src/app/shared/ui/{component}/index.ts`
        3. `src/app/preview/{component}-preview.component.ts`
        """
    )

    preview_coverage = dedent(
        f"""\
        # {component} Preview Coverage

        ## Required Scenarios
        - [ ] all primary input enums
        - [ ] all key state combinations
        - [ ] shadcn preview parity examples
        - [ ] one complex combined scenario

        ## Local Preview Routes
        - main: `/preview?component={component}`
        - reference: `https://ui.shadcn.com/preview/radix/{shadcn_item}-example`

        ## Verification Notes
        - build:
        - tests:
        - manual check:
        """
    )

    return {
        "source-understanding.md": source_understanding,
        "api-diff.md": api_diff,
        "rewrite-plan.md": rewrite_plan,
        "preview-coverage.md": preview_coverage,
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Create component-comparisons skeleton files for rewrite workflow."
    )
    parser.add_argument("--component", required=True, help="Local component directory name.")
    parser.add_argument(
        "--zardui-component",
        help="ZardUI component directory name. Defaults to --component.",
    )
    parser.add_argument(
        "--shadcn-item",
        help="Shadcn item/preview slug. Defaults to --component.",
    )
    parser.add_argument(
        "--output-root",
        default="component-comparisons",
        help="Output root directory. Default: component-comparisons",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Overwrite existing files.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print intended file operations without writing files.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    component = args.component.strip()
    if not component:
        raise SystemExit("--component must not be empty")

    zardui_component = (args.zardui_component or component).strip()
    shadcn_item = (args.shadcn_item or component).strip()

    templates = build_templates(component, zardui_component, shadcn_item)
    output_dir = Path(args.output_root) / component

    print(f"component: {component}")
    print(f"zardui component: {zardui_component}")
    print(f"shadcn item: {shadcn_item}")
    print(f"output directory: {output_dir}")

    if args.dry_run:
        for filename in templates:
            print(f"[dry-run] write {output_dir / filename}")
        return 0

    output_dir.mkdir(parents=True, exist_ok=True)
    for filename, content in templates.items():
        path = output_dir / filename
        if path.exists() and not args.force:
            print(f"skip existing: {path}")
            continue
        path.write_text(content, encoding="utf-8")
        print(f"wrote: {path}")

    print("done")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
