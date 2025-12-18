import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create.user.dto';
import { user as UserModel } from '@prisma/client';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  private toReadUser(user: UserModel) {
    const { password, ...rest } = user;
    return rest;
  }

  async create(dto: CreateUserDto, currentUser: UserModel) {
    if (currentUser.role === 'USER') {
      throw new ForbiddenException('ADMIN must assign group');
    }

    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { groups: true },
    });

    if (exists) {
      throw new ConflictException('User with this email already exists');
    }

    const hash = await bcrypt.hash(dto.password, 10);
    const verifyToken = randomUUID();
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        name: dto.name,
        role: 'USER',
        groups: dto.groupId ? { connect: [{ id: dto.groupId }] } : undefined,
        verifyToken,
      },
    });

    await this.mailService.sendWelcomeEmail(user.email, user.name, verifyToken);
    return this.toReadUser(user);
  }

  async createAdmin(dto: CreateUserDto, groupId?: string) {
    const hash = await bcrypt.hash(dto.password, 10);
    const verifyToken = randomUUID();
    console.log({ verifyToken });

    console.log(typeof verifyToken);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        name: dto.name,
        role: 'ADMIN',
        groups: groupId ? { connect: [{ id: groupId }] } : undefined,
        verifyToken,
      },
    });
    await this.mailService.sendWelcomeEmail(user.email, user.name, verifyToken);
    return this.toReadUser(user);
  }

  async delete(id: string) {
    await this.prisma.user.findUniqueOrThrow({ where: { id } });
    return this.prisma.user.delete({ where: { id } });
  }

  async assignAdminToGroup(userId: string, groupId: string) {
    const existing = await this.prisma.groups.findFirst({
      where: { createdBy: userId },
    });

    if (existing) {
      const ROOTADMIN = await this.prisma.user.findUnique({
        where: { email: 'ROOT_ADMIN@example.com' },
      });
      await this.prisma.groups.update({
        where: { id: existing.id },
        data: { createdBy: ROOTADMIN!.id },
      });
    }

    await this.prisma.groups.update({
      where: { id: groupId },
      data: { createdBy: userId },
    });

    return { message: 'Admin reassigned' };
  }
  async findAll() {
    const users = await this.prisma.user.findMany();
    if (!users) {
      throw new NotFoundException('Users not found!');
    }
    return users;
  }
  async findAllUsers() {
    const users = await this.prisma.user.findMany({
      where: {
        role: 'USER',
      },
      include: {
        notes: true,
        groups: {
          include: {
            creator: true,
          },
        },
      },
    });

    if (!users) {
      throw new NotFoundException('Users not found!');
    }
    return users;
  }
  async findAllAdmin() {
    const users = await this.prisma.user.findMany({ where: { role: 'ADMIN' } });

    if (!users) {
      throw new NotFoundException('Admins not found!');
    }
    return users;
  }
  async getOneUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        notes: true,
      },
    });
    if (!user) {
      throw new NotFoundException('Admins not found!');
    }
    return user;
  }
}
