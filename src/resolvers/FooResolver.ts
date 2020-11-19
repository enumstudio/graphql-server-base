import { Arg, Query, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Foo } from '../entities/Foo';

@Resolver(() => Foo)
export class FooResolver {
  @InjectRepository(Foo) private readonly fooRepo: Repository<Foo>;

  @Query(() => Foo)
  getFoo(@Arg('id') id: string) {
    return this.fooRepo.findOneOrFail(id);
  }
}
