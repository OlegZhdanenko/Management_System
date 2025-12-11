import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from './note.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  // @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateNoteDto) {
    console.log({ dto });

    return this.notesService.create(dto);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('group/:groupId')
  // findAll(@Param('groupId') groupId: string) {
  //   return this.notesService.findAllByGroup(groupId);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.notesService.findOne(id);
  // }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateNoteDto) {
    return this.notesService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notesService.remove(id);
  }
}
