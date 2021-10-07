import { AuthCheckerFn } from 'type-graphql';
import { Context } from '../types/context';

export const authChecker: AuthCheckerFn<Context> = ({ context }) => {
  if (context.userId === '1') {
    return true;
  }

  return true;
};
