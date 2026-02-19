# typography Preview Coverage

## Required Scenarios
- [x] all conflict APIs with shadcn-aligned behavior (N/A - no conflicts)
- [x] all non-conflict extension APIs in plain style
- [x] all key state combinations (N/A - typography directives don't have states)
- [x] shadcn preview parity examples
- [x] one complex combined scenario

## Local Preview Routes
- main: `/preview?component=typography`
- reference: `https://ui.shadcn.com/docs/components/typography`

## Verification Notes
- build: PASSED - `ng build` completed successfully
- tests: N/A - No tests exist for typography directive
- manual check: Available at `/preview/typography`

## Preview Coverage Details

### Headings Section
- `argusxTypographyH1` - Page titles (h1)
- `argusxTypographyH2` - Section titles (h2)
- `argusxTypographyH3` - Subsection titles (h3)
- `argusxTypographyH4` - Minor titles (h4)

### Paragraphs Section
- `argusxTypographyP` - Body text (p)
- `argusxTypographyLead` - Introductory paragraph (p)
- `argusxTypographyMuted` - Secondary/muted text (any element)

### Text Sizes Section
- `argusxTypographyLarge` - Large emphasized text (any element)
- Default text size
- `argusxTypographySmall` - Small text (small)

### Inline Text Section
- `argusxTypographyCode` - Inline code snippets (code)

### Lists Section
- `argusxTypographyList` - Styled lists (ul, ol)

### Blockquote Section
- `argusxTypographyBlockquote` - Quoted text (blockquote)

### Complex Combined Scenario
- Full article demo using all typography styles together
