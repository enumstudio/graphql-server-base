import { IsNotEmpty } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateFooInput {
  @Field()
  @IsNotEmpty()
  name: string;
}
