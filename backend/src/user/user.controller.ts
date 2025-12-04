import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  @UseGuards(LocalAuthGuard)
  create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }
  @UseGuards(LocalAuthGuard)
  @Get()
  getAll() {
    return this.service.findAll();
  }
  @UseGuards(LocalAuthGuard)
  @Get(':id')
  @UseGuards(LocalAuthGuard)
  getById(@Param('id') id: string) {
    return this.service.findById(id);
  }
  @UseGuards(LocalAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.service.update(id, dto);
  }
  @UseGuards(LocalAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
