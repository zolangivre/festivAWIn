# FestivAWIn

## Introduction

FestivAWIn is a web application that helps festival organizers manage board-game consignment sales ("dépôt-vente"). It lets staff register games deposited by sellers, track sales as they happen, and oversee the whole operation. The app provides a simple interface for deposits, sales and invoicing, so organizers can efficiently manage transactions throughout the event.

## Tech stack

- **Front-end**: Angular, chosen to broaden our framework experience after building last year's web project with React. Its CLI speeds up generating components, services and routes, and its structure scales well for a management app expected to grow new features over time.
- **Back-end**: Node.js with Express. Node.js handles frequent, I/O-heavy transactions well and serves many concurrent requests without a performance hit, which fits the bursty traffic of a festival. Express makes it quick to build a scalable REST API on top of it.
- **Database**: MongoDB, accessed through Mongoose for schema and model definitions.

These choices were driven by flexibility, scalability, and development speed.

## Repository structure

This is a monorepo with two projects:

```
back/    # Express + MongoDB REST API — see back/README.md
front/   # Angular web app — see front/README.md
```

Each has its own `package.json`, `.env.example` and README with setup instructions.

## Getting started

```bash
# API
cd back && npm install && cp .env.example .env && npm run dev

# Web app
cd front && npm install && cp .env.example .env && ng serve
```

See [`back/README.md`](back/README.md) and [`front/README.md`](front/README.md) for details on environment variables, scripts, project structure and deployment.
