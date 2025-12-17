import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email!: string;

  @MinLength(4)
  password!: string;

  @IsString()
  name!: string;
  @IsOptional()
  @IsEnum(Role)
  role!: Role;

  @IsOptional()
  @IsString()
  groupId?: string;
}
