import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, notes } from '@prisma/client';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateNoteDto): Promise<notes> {
    return this.prisma.notes.create({
      data: {
        title: data.title,
        content: data.content,
        createdBy: data.userId,
      },
    });
  }

  findById(id: string) {
    return this.prisma.notes.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  update(id: string, data: Prisma.notesUpdateInput) {
    return this.prisma.notes.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.notes.delete({
      where: { id },
    });
  }
}
