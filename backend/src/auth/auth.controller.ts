import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto.ts/register.dto.js';
import { LoginDto } from './dto.ts/login.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('logout')
  async logout(@Body() dto: LoginDto) {
    return this.authService.logout(dto.email);
  }
}
