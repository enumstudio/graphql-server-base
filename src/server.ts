import { TypeOrmConnection } from '@auto-relay/typeorm';
import { ApolloServer, PubSub } from 'apollo-server';
import { AutoRelayConfig } from 'auto-relay';
import { buildSchema } from 'type-graphql';
import Container from 'typedi';
import { createConnection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Foo } from './entities/Foo';
import { FooResolver } from './resolvers/FooResolver';

new AutoRelayConfig({
  orm: () => TypeOrmConnection,
});

interface CreateServerProps {
  connectionOptions?: Partial<PostgresConnectionOptions>;
}

export async function createServer({
  connectionOptions = {},
}: CreateServerProps = {}) {
  const connection = await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [Foo],
    synchronize: true,
    logger: 'debug',
    ...connectionOptions,
  });

  const pubSub = new PubSub();

  const schema = await buildSchema({
    resolvers: [FooResolver],
    container: Container,
    validate: false,
    pubSub,
  });

  const server = new ApolloServer({
    schema,
    playground: true,
    subscriptions: {
      keepAlive: 10000,
    },
  });

  return { server, connection, pubSub };
}
