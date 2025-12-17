import { groups, user } from '@prisma/client';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects = 'all' | 'user' | 'groups' | 'notes';

export type UserWithGroups = user & {
  groups?: groups[];
};
