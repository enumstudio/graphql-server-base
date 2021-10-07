import { TypeOrmConnection } from '@auto-relay/typeorm';
import { AutoRelayConfig } from 'auto-relay';
import dotenv from 'dotenv';
import 'reflect-metadata';
import { Container } from 'typedi';
import { createConnection, useContainer } from 'typeorm';
import { Foo } from './entities/a-Foo';
import { createServer } from './server';

dotenv.config();

new AutoRelayConfig({
  orm: () => TypeOrmConnection,
});

useContainer(Container);

export async function start() {
  await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [Foo],
    synchronize: true,
    logger: 'debug',
  });

  const { startServer } = await createServer();

  const { url, wsUrl } = await startServer();

  console.log(`🚀  Server ready at ${url}`);
  console.log(`🚀  Subscriptions ready at ${wsUrl}`);
}

start();
