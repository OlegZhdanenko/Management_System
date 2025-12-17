import { SetMetadata } from '@nestjs/common';
import { Action, Subjects } from './casl.types';

export const CHECK_ABILITY = 'check_ability';

export interface RequiredRule {
  action: Action;
  subject: Subjects;
}

export const CheckAbilities = (...rules: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITY, rules);
