import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, UserStatus } from '../../prisma/generated-client';

export type DemoCurrentUser = Prisma.UserGetPayload<{
  include: { tenant: true };
}>;

@Injectable()
export class DemoContextService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async getCurrentUser(): Promise<DemoCurrentUser> {
    const email =
      this.configService.get<string>('demoUserEmail') ?? 'elena.cruz@gmail.com';

    const user = await this.prisma.user.findFirst({
      where: {
        email,
        status: UserStatus.ACTIVE,
        deletedAt: null,
        tenant: {
          deletedAt: null,
        },
      },
      include: {
        tenant: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        `Demo user ${email} was not found. Run pnpm run prisma:seed after applying migrations.`,
      );
    }

    return user;
  }
}
