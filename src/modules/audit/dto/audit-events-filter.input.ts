import { Field, InputType, Int } from '@nestjs/graphql';
import { IsDate, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

@InputType()
export class AuditEventsFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  tenantId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  action?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  resourceType?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  dateFrom?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  dateTo?: Date;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number;
}
