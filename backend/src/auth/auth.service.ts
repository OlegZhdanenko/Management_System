import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service.js';
import { RegisterDto } from './dto.ts/register.dto.js';
import { LoginDto } from './dto.ts/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  verifyToken(token: string): { email: string; id: string } {
    return this.jwtService.verify(token, { secret: 'SECRET_KEY' });
  }

  async validateAdmin(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Email or password incorrecttttttt');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Email or password incorrec');
    }

    return user;
  }

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
      throw new UnauthorizedException('Email or password incorrectttttt');
    }

    const isValid = await bcrypt.compare(dto.password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Email or password incorrect');
    }

    const payload = { id: user.id, email: user.email, role: user.role };

    return {
      token: this.jwtService.sign(payload, { secret: 'SECRET_KEY' }),
    };
  }

  async logout(email: string) {
    await this.prisma.user.update({
      where: { email: email },
      data: { token: null },
    });

    return { message: 'Logged out successfully' };
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    return user;
  }
}
