import { RelayedQuery } from 'auto-relay';
import { PubSubEngine } from 'graphql-subscriptions';
import {
  Arg,
  Mutation,
  PubSub,
  Query,
  Resolver,
  Root,
  Subscription,
} from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Foo } from '../entities/a-Foo';
import { CreateFooInput } from '../types/input/create-foo-input';
import { Topics } from '../types/topics';

@Resolver(() => Foo)
export class FooResolver {
  @InjectRepository(Foo) private readonly fooRepo: Repository<Foo>;

  @Query(() => Foo)
  Foo(@Arg('id') id: string) {
    return this.fooRepo.findOneOrFail(id);
  }

  @RelayedQuery(() => Foo)
  allFoos() {
    return this.fooRepo.findAndCount();
  }

  @Mutation(() => Foo)
  async createFoo(
    @Arg('input', () => CreateFooInput) input: CreateFooInput,
    @PubSub() pubSub: PubSubEngine
  ) {
    const foo = this.fooRepo.create(input);
    await this.fooRepo.save(foo);
    pubSub.publish(Topics.NEW_FOO, foo);
    return foo;
  }

  @Subscription({ topics: Topics.NEW_FOO })
  newFoos(@Root() foo: Foo): Foo {
    return foo;
  }
}
