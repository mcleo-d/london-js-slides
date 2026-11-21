# Release process

This covers how a London.js event build moves from a working branch to the
live site, and how to roll it back or archive it afterwards. For adapting the
deck's content for a new event, see
[docs/ADAPT-FOR-NEW-EVENT.md](ADAPT-FOR-NEW-EVENT.md). For the general PR
workflow and pre-merge checklist, see [CONTRIBUTING.md](../CONTRIBUTING.md).

---

## Tag convention

One annotated tag per cache-bust build, plus a small set of named milestones:

| Tag | Meaning |
|---|---|
| `<event>-vNNN` | One per cache-bust build, where `NNN` matches the `?v=` integer bumped in the entry HTML |
| `<event>-rcN` | Release candidate, incrementing from `rc1` |
| `<event>-live` | The build that went live at the event |
| `<event>-final` | The build state at the end of the event, before archiving |
| `<event>-base` | The starting point before any changes for that event |

`<event>` is the same slug used for the archive branch, for example `nov2026`
or `july2026`.

Create an annotated tag (not a lightweight one) so it carries a message:

```bash
git tag -a nov2026-v126 -m "Cache-bust v=126: fix lineup slide spacing"
```

---

## Merge method

Release and go-live PRs for an event (the PRs covered by
[docs/ADAPT-FOR-NEW-EVENT.md](ADAPT-FOR-NEW-EVENT.md)) merge with a **merge
commit only** -- no squash, no rebase. Squashing or rebasing rewrites the
commits a build tag points at, so a tag can end up referencing a commit that
no longer exists on `main`. Merge commits keep every tagged commit reachable
from `main`'s history.

```bash
gh pr merge <PR-number> --merge
```

This is narrower than the general automated-merge policy in
[CONTRIBUTING.md](../CONTRIBUTING.md#merge-policy-for-automated-contributors):
that policy's squash-merge default is for ordinary story and fix PRs, which
carry no build tags. Release and go-live PRs follow the merge-commit rule
above instead.

---

## Production-wiring checklist

Run through this before merging a go-live PR to `main`:

- [ ] `netlify.toml` root redirect points at the new entry file.
- [ ] `README.md` and `AGENTS.md` describe the current event (date, venue,
      host, sponsor, talks).
- [ ] `CHANGELOG.md` has an entry for the current event.
- [ ] The previous entry HTML file is removed from `main` (it stays available
      on its `archive/<month>-<year>` branch).
- [ ] Brand-asset licence notes in `README.md` are current for the assets
      actually in `assets/`.
- [ ] No PII or secrets in any changed file.

---

## After deploy

Once Netlify has deployed the merge to `main`:

1. Open the production root URL and confirm it lands on the new entry HTML
   (check the browser address bar after the redirect, not just the link you
   clicked).
2. View source and confirm the `slides.jsx?v=N` query string matches the
   cache-bust integer you expect for this build.

---

## Rollback

Three options, in order of how much state they touch:

- **Netlify deploy history**: in the Netlify dashboard, roll back to the
  previous production deploy. Fastest option, no git changes.
- **Revert on `main`**: `git revert` the go-live merge commit and push. Use
  this when the Netlify rollback alone would not be enough (for example, the
  problem needs a code fix, not just an older deploy).
- **Present locally from a tag**: for an in-progress event, check out a known
  good tag and serve it locally as a fallback while the live site is fixed:

  ```bash
  git checkout nov2026-live
  make dev
  ```

---

## Archive

After an event ends, create the archive branch from its `-final` tag:

```bash
git branch archive/<month>-<year> <event>-final
git push origin archive/<month>-<year>
```

See [docs/ADAPT-FOR-NEW-EVENT.md](ADAPT-FOR-NEW-EVENT.md) for the full
archive procedure, including the `scripts/archive-event.sh` helper used
before the next event's changes land.

---

## Executor prompts: push and tag are separate steps

Every executor prompt that pushes a build and tags it must list the push and
the tag as separate numbered steps, each verified before moving to the next:

1. Push the branch or merge commit.
2. Confirm it landed:
   ```bash
   git ls-remote origin <branch-or-main>
   ```
   Compare the returned SHA against the local commit before proceeding.
3. Create the annotated tag and push it.
4. Confirm the tag landed:
   ```bash
   git ls-remote --tags origin <tag>
   ```

Do not combine push and tag into one step and assume both succeeded because
the command exited zero -- `git push` can succeed for the branch while a
separate tag push fails, or vice versa.
