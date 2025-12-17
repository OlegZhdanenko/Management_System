import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Post,
  Req,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { GroupsService } from './group.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CaslGuard } from 'src/casl/casl.guard';

import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { CheckAbilities } from 'src/casl/decorators';
import { Action } from 'src/casl/casl.types';

@Controller('groups')
@UseGuards(JwtAuthGuard, CaslGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @CheckAbilities({ action: Action.Create, subject: 'groups' })
  create(@Body() dto: CreateGroupDto, @Req() req) {
    return this.groupsService.create(dto, req.user.id);
  }

  @Get()
  @CheckAbilities({ action: Action.Read, subject: 'groups' })
  findAll() {
    return this.groupsService.findAll();
  }

  @Get(':id')
  @CheckAbilities({ action: Action.Read, subject: 'groups' })
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Put(':id')
  @CheckAbilities({ action: Action.Update, subject: 'groups' })
  update(@Param('id') id: string, @Body() dto: UpdateGroupDto) {
    return this.groupsService.update(id, dto);
  }

  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: 'groups' })
  remove(@Param('id') id: string) {
    return this.groupsService.remove(id);
  }
}
