import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsIn, IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field()
  @IsUUID()
  userId: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Field()
  @IsIn(['ADMINISTRADOR', 'ADMIN', 'NUTRICIONISTA'])
  roleCode: string;
}
