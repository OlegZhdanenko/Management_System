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

  @Post('createAdmin')
  createAdmin(@Body() dto: CreateUserDto) {
    return this.service.createAdmin(dto);
  }
  @Get()
  @UseGuards(LocalAuthGuard)
  getAll() {
    return this.service.findAll();
  }

  @Get('admins')
  getAllAdmin() {
    return this.service.findAllAdmin();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put('assign-admin')
  assignAdminToGroup(
    @Body('userId') userId: string,
    @Body('groupId') groupId: string,
  ) {
    return this.service.assignAdminToGroup(userId, groupId);
  }

  @Put(':id')
  @UseGuards(LocalAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(LocalAuthGuard)
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
