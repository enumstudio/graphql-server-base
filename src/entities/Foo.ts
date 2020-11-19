import { Field, ID, ObjectType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Foo {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;
}
