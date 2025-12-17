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
import { CaslGuard } from 'src/casl/casl.guard';
import { Action } from 'src/casl/casl.types';
import { CheckAbilities } from 'src/casl/decorators';

@Controller('notes')
@UseGuards(JwtAuthGuard, CaslGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @CheckAbilities({ action: Action.Create, subject: 'notes' })
  create(@Body() dto: CreateNoteDto) {
    return this.notesService.create(dto);
  }

  @Get(':id')
  @CheckAbilities({ action: Action.Read, subject: 'notes' })
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(id);
  }

  @Patch(':id')
  @CheckAbilities({ action: Action.Update, subject: 'notes' })
  update(@Param('id') id: string, @Body() dto: UpdateNoteDto) {
    return this.notesService.update(id, dto);
  }

  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: 'notes' })
  remove(@Param('id') id: string) {
    return this.notesService.remove(id);
  }
}
