# graphql-server-base

Starter for a GraphQL server with subscriptions

- [x] Apollo Server
- [x] Express
- [x] TypeGraphQL
- [x] TypeORM
- [x] Auto Relay

## Installation

1. Install PostgreSQL via https://www.postgresql.org/download/ or `brew install postgresql`
2. Install dependencies via `yarn install`
3. Create postgres database with `createdb example`
4. `cp .env.example .env`

## Development

Start the development server

```bash
yarn run dev
```

## Production

Build and start

```bash
yarn run build
yarn start
```

## License

MIT
