import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CaslGuard } from 'src/casl/casl.guard';
import { CheckAbilities } from 'src/casl/decorators';
import { Action } from 'src/casl/casl.types';

@Controller('users')
@UseGuards(JwtAuthGuard, CaslGuard)
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  @CheckAbilities({ action: Action.Create, subject: 'user' })
  create(@Body() dto: CreateUserDto, @Req() req: any) {
    return this.service.create(dto, req.user);
  }
  @Get('all')
  @CheckAbilities({ action: Action.Read, subject: 'user' })
  getAllusers() {
    return this.service.findAllUsers();
  }
  @Get('admins')
  @CheckAbilities({ action: Action.Read, subject: 'user' })
  getAllAdmin() {
    return this.service.findAllAdmin();
  }
  @Get(':id')
  @CheckAbilities({ action: Action.Read, subject: 'user' })
  getUserById(@Param('id') id: string) {
    return this.service.getOneUser(id);
  }
  @Post('createAdmin')
  @CheckAbilities({ action: Action.Manage, subject: 'user' })
  createAdmin(@Body() dto: CreateUserDto) {
    return this.service.createAdmin(dto);
  }

  @Put('assign-admin')
  @CheckAbilities({ action: Action.Manage, subject: 'user' })
  assignAdmin(@Body() body) {
    return this.service.assignAdminToGroup(body.userId, body.groupId);
  }

  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: 'user' })
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
