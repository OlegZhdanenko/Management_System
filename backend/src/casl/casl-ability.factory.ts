import { Injectable } from '@nestjs/common';
import { AbilityBuilder } from '@casl/ability';
import { createPrismaAbility } from '@casl/prisma';
import { Role } from '@prisma/client';
import { Action } from './casl.types';
import { UserWithGroups } from 'src/types/prisma.types';

export type AppAbility = ReturnType<typeof createPrismaAbility>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserWithGroups): AppAbility {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createPrismaAbility,
    );

    const userGroups = user.groups || [];

    if (user.role === Role.ROOT_ADMIN) {
      can(Action.Manage, 'all');
    }

    if (user.role === Role.ADMIN) {
      can(Action.Create, 'user');
      can(Action.Read, 'user');
      can(Action.Read, 'groups');
      can(Action.Read, 'notes', {
        user: {
          groups: {
            some: {
              id: { in: userGroups.map((g) => g.id) },
            },
          },
        },
      });

      cannot(Action.Update, 'notes');
      cannot(Action.Delete, 'notes');
    }

    if (user.role === Role.USER) {
      can(Action.Create, 'notes');
      can(Action.Read, 'notes', { createdBy: user.id });
      can(Action.Update, 'notes', { createdBy: user.id });
      can(Action.Delete, 'notes', { createdBy: user.id });
      can(Action.Read, 'user');
    }

    return build();
  }
}
