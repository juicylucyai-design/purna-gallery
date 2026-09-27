# Purna Gallery website

purnagallery.com: the coming-soon site for Purna, a contemporary South Asian design house in Alserkal Avenue, Dubai.

**In this release**
- One page: hero, position, the four programme pillars, Alserkal Avenue, and a section for designers.
- Notify-me signup. Addresses are stored once (lower-cased); new subscribers get a welcome email.
- Designer enquiry form. Saved first, then the team gets an alert (Reply-To set to the designer) and the designer gets a receipt.
- Spam protection on both forms: a hidden honeypot field and a per-IP rate limit (5 signups / 10 min, 3 enquiries / hour).
- Email is optional. Without `RESEND_API_KEY`, signups and enquiries are still saved; nothing is sent.

## Architecture

Layers × modules, the same pattern as the NKSquared portfolio app. Each module owns its tables and exposes one
`index.ts`; layers only call downward.

```
web/                        View: Next.js, exported as static files and served by the server
  app/                      page.tsx (the coming-soon page), not-found.tsx, globals.css (design tokens)
  components/               one component per page section, plus NotifyForm and EnquiryForm
  content/site.json         all page copy. Edit words here, not in components
  lib/content.ts            typed loader for site.json (swap for a CMS here, later)
  lib/api.ts                the only code that calls the server
  public/images/            images from the Purna deck
contracts/index.d.ts        request/response types shared by web and server
server/
  src/main.ts               starts Nest, runs migrations, serves web/out
  src/common/               input validation, rate limiter, static page serving + security headers
  src/database/             Postgres pool, migration runner, /api/health
  src/modules/
    waitlist/               waitlist_subscribers; POST /api/waitlist
    enquiry/                designer_enquiries; POST /api/enquiries
    notification/           what email to send and to whom; email/ holds the Resend adapter
  db/migrations/            one SQL file per module, applied in order on startup
  test/                     node:test unit tests with in-memory stand-ins for the database and email
```

Each module splits the same way: `*.controller.ts` (HTTP: validate, rate-limit) → `*.service.ts` (the rules)
→ `*.repository.ts` (SQL). `npm run check:boundaries` fails the build if a module reaches into another module's
internals, a controller touches a repository, a service touches HTTP, or the web app imports server code.

Constructors use explicit `@Inject(...)` so dependency injection works the same under `tsc` and under `tsx` (dev and tests).

### Where a change goes

| Change | Touch | Untouched |
| --- | --- | --- |
| Edit copy | `web/content/site.json` | all code |
| Redesign | `web/app/globals.css`, `web/components/` | server |
| Change email wording | `server/src/modules/notification/templates.ts` | everything else |
| Swap Resend | new `EmailSender` class, one binding in `notification.module.ts` | waitlist, enquiry |
| Add double opt-in | `waitlist.service.ts` + a template | form, controller, SQL |
| Launch the collection | new `server/src/modules/collection/` + new pages | existing modules |

## Running locally

```bash
npm install
npm run db:local          # Postgres-compatible database in .local-db/ on port 5432 (leave running)
cp .env.example .env      # then fill in what you need
npm run dev:server        # API on :3000
npm run dev:web           # site on :3001, forwards /api to :3000
```

Production-style run: `npm run build`, then `npm start` (site and API together on `PORT`, default 3000).

Checks: `npm test`, `npm run typecheck`, `npm run check:boundaries`.

## Deploying on Railway

1. Push this folder to its own GitHub repository.
2. In a new Railway project: add a **PostgreSQL** service, then a service from the GitHub repo. `railway.json`
   sets the build (`npm run build`), start (`npm start`) and health check (`/api/health`).
3. Variables on the web service:
   - `DATABASE_URL` = `${{Postgres.DATABASE_URL}}`
   - `TEAM_EMAIL_TO` = `sanjana@purnagallery.com`
   - `RESEND_API_KEY` and `EMAIL_FROM` once purnagallery.com is verified in Resend
4. Point purnagallery.com at the service under Settings → Networking → Custom domain.

Migrations run automatically on every start.

## Reading signups and enquiries

Until an admin page exists, query the Railway database directly (Railway → Postgres → Data), or:

```sql
SELECT email, subscribed_at FROM waitlist_subscribers ORDER BY subscribed_at DESC;
SELECT received_at, name, email, studio, programme_area, message FROM designer_enquiries ORDER BY received_at DESC;
```
