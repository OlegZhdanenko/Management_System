import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create.user.dto';
import { MailService } from '../mail/mail.service';
import { UserRepository } from './user.repository';
import { user as UserModel } from '@prisma/client';
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
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

    const exists = await this.userRepository.findByEmail(dto.email);
    if (exists) {
      throw new ConflictException('User with this email already exists');
    }

    const hash = await bcrypt.hash(dto.password, 10);
    const verifyToken = randomUUID();

    const user = await this.userRepository.create({
      email: dto.email,
      password: hash,
      name: dto.name,
      role: 'USER',
      groups: dto.groupId ? { connect: [{ id: dto.groupId }] } : undefined,
      verifyToken,
    });

    await this.mailService.sendWelcomeEmail(user.email, user.name, verifyToken);

    return this.toReadUser(user);
  }

  async createAdmin(dto: CreateUserDto, groupId?: string) {
    const exists = await this.userRepository.findByEmail(dto.email);
    if (exists) {
      throw new ConflictException('Admin with this email already exists');
    }

    const hash = await bcrypt.hash(dto.password, 10);
    const verifyToken = randomUUID();

    const user = await this.userRepository.create({
      email: dto.email,
      password: hash,
      name: dto.name,
      role: 'ADMIN',
      groups: groupId ? { connect: [{ id: groupId }] } : undefined,
      verifyToken,
    });

    await this.mailService.sendWelcomeEmail(user.email, user.name, verifyToken);

    return this.toReadUser(user);
  }

  async delete(id: string) {
    await this.userRepository.findByIdOrThrow(id);
    return this.userRepository.delete(id);
  }

  async assignAdminToGroup(userId: string, groupId: string) {
    const existingGroup = await this.userRepository.findGroupCreatedBy(userId);

    if (existingGroup) {
      const rootAdmin = await this.userRepository.findByEmail(
        'ROOT_ADMIN@example.com',
      );

      if (!rootAdmin) {
        throw new NotFoundException('Root admin not found');
      }

      await this.userRepository.updateGroup(existingGroup.id, {
        createdBy: rootAdmin.id,
      });
    }

    await this.userRepository.updateGroup(groupId, {
      createdBy: userId,
    });

    return { message: 'Admin reassigned' };
  }

  async findAll() {
    const users = await this.userRepository.findAll();
    if (!users.length) {
      throw new NotFoundException('Users not found!');
    }
    return users;
  }

  async findAllUsers() {
    const users = await this.userRepository.findAllUsers();
    if (!users.length) {
      throw new NotFoundException('Users not found!');
    }
    return users;
  }

  async findAllAdmin() {
    const admins = await this.userRepository.findAllAdmins();
    if (!admins.length) {
      throw new NotFoundException('Admins not found!');
    }
    return admins;
  }

  async getOneUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    return user;
  }
}
