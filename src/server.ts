import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { execute, subscribe } from 'graphql';
import { createServer as createHttpServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { authChecker } from './lib/auth-checker';
import { createContext } from './lib/create-context';
import { FooResolver } from './resolvers/foo-resolver';

export async function createServer() {
  // create express app
  const app = express();

  // create http server
  const httpServer = createHttpServer(app);

  // build schema with type-graphql
  const schema = await buildSchema({
    resolvers: [FooResolver],
    container: Container,
    authChecker,
  });

  // default graphql path
  let graphqlPath = '/graphql';

  // create subscriptions server
  const subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: graphqlPath }
  );

  // create apollo server
  const apolloServer = new ApolloServer({
    schema,
    context: createContext,
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });

  // update graphql path
  graphqlPath = apolloServer.graphqlPath;

  async function startServer(port: number | string = process.env.PORT || 4000) {
    // start apollo server
    await apolloServer.start();

    // apply apollo-server middleware to express app
    apolloServer.applyMiddleware({ app });

    // start http server
    return new Promise<{ url: string; wsUrl: string }>((resolve) => {
      httpServer.listen(port, () => {
        resolve({
          url: `http://localhost:${port}${graphqlPath}`,
          wsUrl: `ws://localhost:${port}${graphqlPath}`,
        });
      });
    });
  }

  return { startServer, httpServer, subscriptionServer, apolloServer };
}
