// auth.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Headers,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { STATUS_CODES } from 'node:http';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto.ts/register.dto.js';
import { LoginDto } from './dto.ts/login.dto.js';
import { LocalAuthGuard } from './local-auth.guard.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Headers('authorization') authHeader: string) {
    const token = authHeader.split(' ')[1];
    const payload = this.authService.verifyToken(token);
    return this.authService.logout(payload.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    const email = req.user.email;
    try {
      const user = await this.authService.getUserByEmail(email);
      return {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
      };
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    } catch (error) {
      throw new UnauthorizedException(STATUS_CODES[401]);
    }
  }
}
