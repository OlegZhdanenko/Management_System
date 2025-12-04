import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service.js';
import { user } from '@prisma/client';
import { RegisterDto } from './dto.ts/register.dto.js';
import { LoginDto } from './dto.ts/login.dto.js';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(dto: RegisterDto) {
    const isExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (isExists) {
      throw new ConflictException('User already exist');
    }
    const hash = await bcrypt.hash(dto.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hash,
        role: dto.role,
      },
    });
    return newUser;
  }
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email or password incorrect');
    }

    const isValid = await bcrypt.compare(dto.password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Email or password incorrect');
    }

    const payload = { id: user.id, email: user.email };

    return {
      token: this.jwtService.sign(payload),
    };
  }
  async logout(email: string) {
    await this.prisma.user.update({
      where: { email: email },
      data: { token: null },
    });

    return { message: 'Logged out successfully' };
  }
}
