import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GroupsService } from './group.service';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateGroupDto, @Req() req) {
    const userId = req.user.id;
    return this.groupsService.create(dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.groupsService.findAll();
  }

  // @UseGuards(JwtAuthGuard)
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.groupsService.findOne(id);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Put(':id')
  // update(@Param('id') id: string, @Body() dto: UpdateGroupDto) {
  //   return this.groupsService.update(id, dto);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.groupsService.remove(id);
  // }
}
