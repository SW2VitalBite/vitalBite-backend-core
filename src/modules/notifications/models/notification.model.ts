import { Field, ID, ObjectType } from '@nestjs/graphql';
import { NotificationType } from '../../../prisma/generated-client';

@ObjectType('Notification')
export class NotificationModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  tenantId: string;

  @Field(() => ID)
  patientId: string;

  @Field(() => NotificationType)
  type: NotificationType;

  @Field()
  title: string;

  @Field()
  body: string;

  @Field()
  isRead: boolean;

  @Field()
  createdAt: Date;
}
