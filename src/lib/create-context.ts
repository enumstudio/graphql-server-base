import { ContextFunction } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express';
import { Context } from '../types/context';

export const createContext: ContextFunction<ExpressContext> = (
  ctx
): Context => {
  return {
    ...ctx,
    userId: '1',
  };
};
