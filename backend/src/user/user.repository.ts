import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create.user.dto';
import { Prisma, user as UserModel } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { groups: true },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { notes: true },
    });
  }

  findByIdOrThrow(id: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findAllUsers() {
    return this.prisma.user.findMany({
      where: { role: 'USER' },
      include: {
        notes: true,
        groups: {
          include: { creator: true },
        },
      },
    });
  }

  findAllAdmins() {
    return this.prisma.user.findMany({
      where: { role: 'ADMIN' },
    });
  }

  create(data: Prisma.userCreateInput) {
    return this.prisma.user.create({ data });
  }

  delete(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  update(id: string, data: CreateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  findGroupCreatedBy(userId: string) {
    return this.prisma.groups.findFirst({
      where: { createdBy: userId },
    });
  }

  updateGroup(groupId: string, data: { createdBy: string }) {
    return this.prisma.groups.update({
      where: { id: groupId },
      data,
    });
  }
}
