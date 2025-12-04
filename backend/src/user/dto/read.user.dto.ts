import { Role } from '@prisma/client';

export class ReadUserDto {
  id!: string;
  email!: string;
  name!: string;
  role!: Role;
  groupId?: string;
  createdAt!: Date;
  updatedAt!: Date;
}
