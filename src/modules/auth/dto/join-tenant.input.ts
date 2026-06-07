import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class JoinTenantInput {
  @Field()
  @IsString()
  @MinLength(1)
  firstName: string;

  @Field()
  @IsString()
  @MinLength(1)
  lastName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;

  @Field()
  @IsString()
  @MinLength(3)
  officeCode: string;
}
