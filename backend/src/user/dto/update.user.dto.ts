import { Type } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create.user.dto';

export class UpdateUserDto extends PartialType(
  CreateUserDto as Type<CreateUserDto>,
) {}
