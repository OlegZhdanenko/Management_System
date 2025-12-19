import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NotesRepository } from './notes.repository';

@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepository) {}

  async create(dto: CreateNoteDto) {
    const { title, content, userId } = dto;

    return this.notesRepository.create({
      title,
      content,
      userId,
    });
  }

  async findOne(id: string) {
    const note = await this.notesRepository.findById(id);

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  async update(id: string, dto: UpdateNoteDto) {
    await this.findOne(id);

    return this.notesRepository.update(id, { ...dto, updated_at: new Date() });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.notesRepository.delete(id);
  }
}
