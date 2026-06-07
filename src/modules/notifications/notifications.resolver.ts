import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthContextService } from '../auth/auth-context.service';
import { NotificationModel } from './models/notification.model';
import { NotificationsService } from './notifications.service';

@Resolver(() => NotificationModel)
export class NotificationsResolver {
  constructor(
    private readonly authContext: AuthContextService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Query(() => [NotificationModel])
  async myNotifications(
    @Args('patientId', { type: () => ID }) patientId: string,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.notificationsService.myNotifications(currentUser, patientId);
  }

  @Query(() => Int)
  async unreadNotificationsCount(
    @Args('patientId', { type: () => ID }) patientId: string,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    return this.notificationsService.unreadCount(currentUser, patientId);
  }

  @Mutation(() => Boolean)
  async markNotificationRead(@Args('id', { type: () => ID }) id: string) {
    const currentUser = await this.authContext.getCurrentUser();
    await this.notificationsService.markRead(currentUser, id);
    return true;
  }

  @Mutation(() => Boolean)
  async markAllNotificationsRead(
    @Args('patientId', { type: () => ID }) patientId: string,
  ) {
    const currentUser = await this.authContext.getCurrentUser();
    await this.notificationsService.markAllRead(currentUser, patientId);
    return true;
  }
}
