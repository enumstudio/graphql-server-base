require('dotenv').config({
  path: '.env',
});

import 'reflect-metadata';
import { Container } from 'typedi';
import { useContainer } from 'typeorm';
import { createServer } from './server';

useContainer(Container);

createServer().then(async ({ server }) => {
  const { url, subscriptionsUrl } = await server.listen(
    process.env.PORT || 4000
  );
  console.log(`🚀  Server ready at ${url}`);
  console.log(`🚀  Subscriptions ready at ${subscriptionsUrl}`);
});
