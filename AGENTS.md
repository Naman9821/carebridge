<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- Pages read/write data only through `useStore()` in `src/data/store.tsx` (types in `src/data/types.ts`); swap its actions for database/auth calls later without touching pages.
- Shared presentational primitives live in `src/components/ui-kit.tsx`; layout/sidebar in `src/components/AppShell.tsx`, mounted in `__root.tsx`.
