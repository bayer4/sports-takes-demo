# Sports Take Ledger (Demo)

A **sanitized demo** of a larger project: log sports predictions ("takes"), store them in a real DB, and render them in a feed.

This demo intentionally keeps scope tight to show a clean full-stack vertical slice:
- Next.js App Router UI
- Prisma + SQLite data model
- API routes for create/list/update

## Features
- ✅ Post new takes with confidence level (HUNCH / NORMAL / BOLD)
- ✅ Resolve takes as HIT, MISS, or PUSH
- ✅ Inline validation with character limits
- ✅ Chronological feed of all takes

## Tech Stack
- Next.js 16 (App Router)
- TypeScript
- Prisma + PostgreSQL (Neon)
- React 19

## Run locally

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env

# 3. Run database migrations
npx prisma migrate dev --name init

# 4. (Optional) Seed with sample data
npm run seed

# 5. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run seed` | Populate DB with sample takes |
| `npm run prisma:studio` | Open Prisma Studio GUI |
