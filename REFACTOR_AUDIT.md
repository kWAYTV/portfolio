# Web App Code Organization Audit

## Current State

### Largest Files (by line count)
| File | Lines | Issue |
|------|-------|-------|
| `packages/ui/timeline.tsx` | 760 | Monolithic shadcn component, many sub-components in one file |
| `apps/web/ide/mock-terminal.tsx` | 725 | FILE_CONTENTS (~150 lines), command execution, tab completion, UI all mixed |
| `apps/web/ide/ide-layout.tsx` | 615 | All tab logic, keyboard shortcuts, sidebar state in one component |
| `apps/web/ide/editor-tabs.tsx` | 343 | TabItem inline, could extract |
| `apps/web/ide/sidebar.tsx` | 275 | explorerTree inline, could extract |
| `apps/web/ide/activity-bar.tsx` | 258 | Acceptable |

### Duplication
- `compose-refs.ts` exists in both `apps/web/src/lib/` and `packages/ui/src/` — **apps/web version is UNUSED** (only packages/ui uses it for timeline)

### Folder Structure (apps/web)
```
src/
├── app/           # Next.js app router ✓
├── components/    # By feature: ide, blog, home, projects, about, shared, theming, analytics ✓
├── consts/        # Static data ✓
├── hooks/         # use-can-hover ✓
├── lib/           # Utils, metadata, github, etc. ✓
├── modules/       # i18n ✓
└── styles/        # globals.css ✓
```

Structure is reasonable. Main issues: **file length** and **mixed concerns**.

## Refactoring Plan

### Phase 1: ide-layout.tsx (615 → ~200)
- Extract `useEditorGroups` hook → `hooks/use-editor-groups.ts`
- Extract `matchNavItem`, `getBreadcrumbPath` → `lib/ide/breadcrumb.ts`
- Extract keyboard handler → `hooks/use-ide-keyboard-shortcuts.ts`

### Phase 2: mock-terminal.tsx (725 → ~250)
- Extract `FILE_CONTENTS` → `components/ide/terminal/file-contents.ts`
- Extract `executeCommand`, tab completion utils → `components/ide/terminal/commands.ts`
- Extract `Prompt` component → `components/ide/terminal/prompt.tsx`

### Phase 3: Cleanup
- Remove dead `apps/web/src/lib/compose-refs.ts`
- Extract `explorerTree` from sidebar → `consts/explorer-tree.ts`
- Extract `TabItem` from editor-tabs → `editor-tab-item.tsx` (optional, 343 is borderline)

### Phase 4: packages/ui timeline (skipped)
- Split into `timeline/` folder with root, item, dot, connector, content, variants, context
- Skipped — shadcn/diceui component, higher risk, affects package exports

---

## Completed (this session)
- ✅ ide-layout: extracted useEditorGroups, useIdeKeyboardShortcuts, lib/ide/breadcrumb
- ✅ mock-terminal: extracted terminal/file-contents, terminal/commands, terminal/prompt
- ✅ Removed dead apps/web/src/lib/compose-refs.ts
- ✅ Extracted explorerTree to consts/explorer-tree.ts
- ✅ Breadcrumbs now use getBreadcrumbParts from lib
- ✅ nav-items: added NavItem type export
