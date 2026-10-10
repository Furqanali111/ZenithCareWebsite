# Zenith Care Solutions — Monorepo

Marketing website and (future) client-facing services for Zenith Care Solutions LLC.

**Business context**: see [`CLAUDE.md`](CLAUDE.md).
**Full planning docs**: [`WebSiteDoc/`](WebSiteDoc/).
**For Claude sessions**: read [`WebSiteDoc/12-claude-requirements.md`](WebSiteDoc/12-claude-requirements.md) first.

---

## Repo layout

```
.
├── CLAUDE.md              ← pinned project context (session-start reading)
├── README.md              ← you are here
├── .gitignore
├── .editorconfig
├── Doc/                   ← business reference PDFs (do not edit)
├── WebSiteDoc/            ← product + technical planning docs
└── web/                   ← Next.js marketing website
```

### Future additions (not built yet)

```
├── api/                   ← backend service (when client portal is needed)
├── packages/              ← shared types/utilities (when there are 2+ apps)
└── pnpm-workspace.yaml    ← added at that point
```

**Do not create `api/` or `packages/` before there is a real need.** Converting a single-app repo to a pnpm workspace later is a 15-minute change; the reverse is painful.

---

## Projects

| Folder | What it is | Status |
|---|---|---|
| [`web/`](web/) | Next.js 14 marketing site, deployed to Vercel | scaffolded, awaiting bootstrap |
| `api/` | Backend service (client portal, invoice access, etc.) | **not yet needed** — add when first client requests a portal |

---

## Quick start — marketing site

```bash
cd web
# Bootstrap Next.js (one-time, see web/README.md for the exact command)
pnpm install
pnpm dev
```

Full bootstrap instructions in [`web/README.md`](web/README.md).

---

## Git workflow

**Hard rules** — enforced for everyone, every time:

- `develop` is the source of truth. **Never push to `develop` or any `release/*` directly** — PR only.
- Branches: `feature/<title>`, `defect/<title>`, `hotfix/<title>`. Lowercase, kebab-case.
- Rebase (never merge) `develop` into your branch. Squash-merge PRs. Conventional Commits.
- Full details: [`WebSiteDoc/11-git-workflow.md`](WebSiteDoc/11-git-workflow.md).

---

## Deployment

- `web/` deploys to Vercel.
- Vercel is configured to build **`release/*`** branches to the production domain.
- Every PR gets a Vercel preview URL automatically.
- HTTPS via Let's Encrypt (auto-provisioned, auto-renewed — nothing to buy).

Launch procedure: [`WebSiteDoc/10-launch-checklist.md`](WebSiteDoc/10-launch-checklist.md).
