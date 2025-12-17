import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from './casl-ability.factory';
import { CHECK_ABILITY, RequiredRule } from './decorators';
import { UserWithGroups } from 'src/types/prisma.types';
import { AppAbility } from './casl-ability.factory';

@Injectable()
export class CaslGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly abilityFactory: CaslAbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const rules =
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) ??
      [];

    if (rules.length === 0) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<{ user: UserWithGroups }>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not found in request');
    }

    const ability: AppAbility = this.abilityFactory.createForUser(user);

    const isAllowed = rules.every((rule) =>
      ability.can(rule.action, rule.subject),
    );

    if (!isAllowed) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
