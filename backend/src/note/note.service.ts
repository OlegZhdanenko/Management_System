import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNoteDto) {
    return this.prisma.notes.create({
      data: {
        title: dto.title,
        content: dto.content,
        createdBy: dto.userId,
      },
    });
  }

  async findOne(id: string) {
    const note = await this.prisma.notes.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  async update(id: string, dto: UpdateNoteDto) {
    await this.findOne(id);

    return this.prisma.notes.update({
      where: { id },
      data: {
        ...dto,
        updated_at: new Date(),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.notes.delete({
      where: { id },
    });
  }
}
