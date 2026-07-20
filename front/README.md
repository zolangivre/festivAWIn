# FestivAWIn — Front-end

Angular web app for FestivAWIn, a board-game consignment sale ("dépôt-vente") management system used at festivals. It lets sellers deposit games, staff record sales, and admins track balances and generate invoices.

Live site: https://festivawin-b8551f870523.herokuapp.com/

## Tech stack

- Angular 19 + Angular Material / CDK
- RxJS
- `@auth0/angular-jwt` for authentication
- Express (used only to serve the built app in production, see `server.js`)

## Requirements

- Node.js 22.x
- npm 10.x

## Setup

```bash
npm install
cp .env.example .env
```

## Development

```bash
ng serve
```

Then open `http://localhost:4200/`. The app reloads automatically on source changes.

## Build

```bash
npm run build
```

Build artifacts are written to `dist/`.

## Serving the production build

```bash
npm run build-and-start
```

This builds the app and serves it with the small Express server in `server.js` (respects the `PORT` environment variable, defaults to `4200`).

## Tests

```bash
npm test
```

Unit tests run via Karma/Jasmine.

## Project structure

```
src/app/
  components/   # Feature components: vente, item, user, admin, bilan, login, countdown, dialogue, root
  services/     # HTTP/business services (auth, users, items, ventes, sessions, bilans, factures)
  models/       # TypeScript models
  guards/       # Route guards (auth, session)
```

## API

The app talks to the FestivAWIn back-end API (see [`../back`](../back)). The API base URL is configured per environment in `src/environments/`.

## Deployment

The app is built and deployed on Heroku.
