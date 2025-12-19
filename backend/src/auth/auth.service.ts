import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from './auth.repository';
import { RegisterDto } from './dto.ts/register.dto';
import { LoginDto } from './dto.ts/login.dto';
import { VerifyUserDto } from './dto.ts/verify-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  verifyToken(token: string): { email: string; id: string } {
    return this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
  }

  async validateAdmin(email: string, password: string) {
    const user = await this.authRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Email or password incorrect');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Email or password incorrect');
    }

    return user;
  }

  async register(dto: RegisterDto) {
    const exists = await this.authRepository.findByEmail(dto.email);

    if (exists) {
      throw new ConflictException('User already exist');
    }

    const hash = await bcrypt.hash(dto.password, 10);

    return this.authRepository.create({
      name: dto.name,
      email: dto.email,
      password: hash,
      role: dto.role,
    });
  }

  async login(dto: LoginDto) {
    const user = await this.authRepository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Email or password incorrect');
    }

    if (!user.verify) {
      throw new ForbiddenException('Account is not verified');
    }

    const isValid = await bcrypt.compare(dto.password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Email or password incorrect');
    }

    const payload = { id: user.id, email: user.email, role: user.role };

    return {
      token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET }),
    };
  }

  async logout(email: string) {
    await this.authRepository.updateByEmail(email);

    return { message: 'Logged out successfully' };
  }

  async getUserByEmail(email: string) {
    const user = await this.authRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  async verifyUser(dto: VerifyUserDto) {
    const user = await this.authRepository.findByEmail(dto.email);

    if (!user || user.verify) {
      throw new BadRequestException('Invalid verification request');
    }

    if (user.verifyToken !== dto.token) {
      throw new BadRequestException('Invalid verification token');
    }

    await this.authRepository.updateById(user.id, {
      verify: true,
      verifyToken: null,
    });

    return { message: 'Account verified successfully' };
  }
}
