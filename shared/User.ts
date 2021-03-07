import 'reflect-metadata';
import { ObjectType, Field, ID } from 'type-graphql';
import { FieldError } from './FieldError';

@ObjectType()
export class User {
  @Field((type) => ID)
  id: string;
  @Field()
  username: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}
