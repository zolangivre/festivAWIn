# FestivAWIn — Back-end

REST API for FestivAWIn, a board-game consignment sale ("dépôt-vente") management system used at festivals. Built with Node.js, Express and MongoDB (Mongoose).

## Tech stack

- Node.js / Express
- MongoDB with Mongoose
- JWT + session-based authentication (`jsonwebtoken`, `express-session`)
- `bcrypt` for password hashing
- `pdfkit` for invoice generation
- Jest + Supertest for tests

## Requirements

- Node.js 22.x
- npm 10.x
- A MongoDB Atlas cluster (or any MongoDB instance)

## Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env` with your own values (see below), then start the server:

```bash
npm run dev    # nodemon, auto-reload
npm start      # plain node
```

## Environment variables

| Variable       | Description                                      |
| -------------- | ------------------------------------------------- |
| `DB_USER`      | MongoDB username                                   |
| `DB_PASSWORD`  | MongoDB password                                   |
| `DB_NAME`      | MongoDB database name                              |
| `CLUSTER_NAME` | MongoDB Atlas cluster name                         |
| `API_URL`      | URL of the front-end app (used for CORS)           |
| `PORT`         | Port the server listens on (defaults to `3000`)    |
| `SECRET`       | Secret used to sign sessions/JWTs                  |

Never commit `.env` — it's git-ignored. Use `.env.example` as the template.

## Project structure

```
app.js            # Express app setup, DB connection, middleware, route mounting
server.js         # HTTP server bootstrap
routes/           # Express routers, one per resource
controllers/      # Route handlers / business logic
models/           # Mongoose schemas
test/             # Jest/Supertest test suites
```

## API overview

All routes are mounted under `/api`:

| Base route          | Resource                                    |
| -------------------- | -------------------------------------------- |
| `/api/utilisateur`   | Users (buyers, sellers, admins)              |
| `/api/jeuDepot`       | Games deposited for sale                     |
| `/api/vente`          | Sales                                        |
| `/api/venteJeu`       | Sale/game line items                         |
| `/api/session`        | Festival sessions                            |
| `/api/admin`          | Admin-only operations                        |
| `/api/bilan`          | Balance / settlement reports                 |
| `/api/facture`        | Invoice generation (PDF)                     |

## Testing

```bash
npm test
```

## Deployment

The API is deployed on Heroku.
