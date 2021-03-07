import 'reflect-metadata';
import { Role } from '@prisma/client';
import { ObjectType, Field, ID } from 'type-graphql';
import { FieldError } from './FieldError';

@ObjectType()
export class User {
  @Field((type) => ID)
  id: number;
  @Field()
  username: string;
  @Field((type) => [String])
  roles?: String[];
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}
