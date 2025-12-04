import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  password: string;

  @IsString()
  name: string;

  @IsEnum(Role)
  role!: Role;

  @IsOptional()
  @IsString()
  groupId?: string;
}
