import { Prisma } from '@prisma/client';

export type UserWithGroups = Prisma.userGetPayload<{
  include: { groups: true };
}>;
