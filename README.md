# Regulex Intelligence

Distribution intelligence dashboard prototype for UK multi-asset managers. Built for Meridian Asset Management (fictional £14.8bn AUM firm).

Designed for senior distribution professionals — Heads of Distribution, senior RMs, CCOs — at mid-market UK asset managers.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No environment variables required — all data is mocked.

## Pages

- **Morning Brief** (`/`) — Daily overview with priority clients, market intelligence, and key metrics
- **Priority Queue** (`/priorities`) — Ranked client urgency with composite scoring and silent account alerts
- **Client Intelligence** (`/clients`) — Deep client profiles with engagement analytics, timelines, and pre-meeting briefs
- **Flow Intelligence** (`/flows`) — AUM flow analysis, mandate fit scanning, and account movement tracking
- **RFP Intelligence** (`/rfp`) — Pipeline management with win rate insights and data source automation

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts
- Lucide React
- shadcn/ui components

## Deployment

For deployment to a subdomain of regulex.io (e.g., demo.regulex.io):

1. Push to GitHub
2. Connect the repo to [Vercel](https://vercel.com)
3. Set custom domain: `demo.regulex.io`
4. No environment variables needed

```bash
npm run build
```

The build output is a static Next.js app ready for any Node.js hosting platform.
