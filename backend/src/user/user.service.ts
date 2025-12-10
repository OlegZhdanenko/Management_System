import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { UpdateUserDto } from './dto/update.user.dto';
import { CreateUserDto } from './dto/create.user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private toReadUser(users: any) {
    const { password, ...rest } = users;
    return rest;
  }

  async create(dto: CreateUserDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (exists) {
      throw new ConflictException('User with this email already exists');
    }
    const hash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        name: dto.name,
        role: dto.role,
      },
    });

    return user;
  }
  async createAdmin(dto: CreateUserDto, id?: string) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (exists) {
      throw new ConflictException('User with this email already exists');
    }

    const hash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        name: dto.name,
        role: 'ADMIN',
        groups: id ? { connect: { id } } : undefined,
      },
    });

    return this.toReadUser(user);
  }

  async findAllAdmin() {
    const users = await this.prisma.user.findMany({ where: { role: 'ADMIN' } });

    if (!users) {
      throw new NotFoundException('Admins not found!');
    }
    return users;
  }
  async findAll() {
    const users = await this.prisma.user.findMany();
    if (!users) {
      throw new NotFoundException('Users not found!');
    }
    return users;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findById(id);

    const data: any = { ...dto };

    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data,
    });

    return this.toReadUser(updated);
  }

  async delete(id: string) {
    await this.findById(id);

    return this.prisma.user.delete({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async assignAdminToGroup(userId: string, groupId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const group = await this.prisma.groups.findUnique({
      where: { id: groupId },
    });

    if (!user || !group) {
      throw new NotFoundException('User or Group not found');
    }

    // await this.prisma.user.update({
    //   where: { id: userId },
    //   data: {
    //     groups: { connect: { id: groupId } },
    //   },
    // });
    await this.prisma.groups.update({
      where: { id: groupId },
      data: {
        createdBy: userId,
      },
    });
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        groups: {
          connect: { id: groupId },
        },
        role: 'ADMIN',
      },
    });

    return { message: 'Admin assigned to group' };
  }
}
