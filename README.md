# BELAY

90 minutes at a time. One small thing you can finish. Someone else confirms you showed up.

BELAY is a check-in app for people who need a short, witnessed block of time — not a streak, not a lecture. You start a 90-minute block, name a confirmer, and check in when you are actually there. It only counts when they confirm they saw you. Showing up after a slip still counts. Going silent is the miss.

## How it works

1. **Pick 90 minutes** — write one small task and who is checking on you.
2. **Check in** — *I'm here (sober)* or *I used, but I showed up*.
3. **They confirm** — the other person opens Confirm and verifies they actually saw you.
4. **Pause if you need it** — a 10-minute freeze if a craving hits.
5. **Don't disappear** — if the clock runs out with no check-in, the block is marked silent and the backup can get a note.

## Screens

| Route | Purpose |
| --- | --- |
| `/` | Start a block, run the clock, check in |
| `/confirm` | Confirmer view — verify someone showed up |
| `/tape` | Recent blocks and 14-day totals |
| `/login` | Sign in |

Confirmers can land on a specific block with `/confirm?block_id=...`.

## Stack

- React 19 + TypeScript
- TanStack Start / Router / Query
- Tailwind CSS v4
- Better Auth
- Postgres in production; PGlite for local
- Vite

## Setup

```bash
npm install
cp .env.example .env   # if you keep local secrets out of the repo
npm run dev
```

Dev server binds `0.0.0.0:8080`.

```bash
npm run build        # production build + migrations
npm run typecheck
npm test
npm run lint
```

## Project layout

```
src/routes/          pages and API routes
src/components/      shell, clock, confirm UI
src/lib/belay/       clock, labels, actions, invite copy
src/lib/auth/        session and sign-in
supabase/            SQL migrations
public/              PWA manifest and service worker
```

## Notes

- A block is confirmed only when the named confirmer marks that they saw you.
- Backup email is optional and is for silence — not for routine check-ins.
- Use your own email as confirmer when you are testing on one device.
