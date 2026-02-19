# tabs Preview Coverage

## Covered Scenarios

| Scenario | File | API Covered |
| --- | --- | --- |
| Controlled tabs with value binding | tabs-preview.component.ts | value (model), valueChange |
| Uncontrolled tabs with defaultValue | tabs-preview.component.ts | defaultValue |
| Line variant | tabs-preview.component.ts | variant="line" |
| Vertical orientation | tabs-preview.component.ts | orientation="vertical" |
| Disabled tabs | tabs-preview.component.ts | disabled, [disabled] on trigger |
| Default variant | tabs-preview.component.ts | variant="default" |

## Missing Scenarios
- None currently covered.

## Manual Verification Checklist
- [x] Build passes
- [x] Preview route /preview/tabs exists in app.routes.ts
- [x] All API inputs have corresponding preview examples
- [x] Accessibility: roles (tablist, tab, tabpanel), aria attributes
