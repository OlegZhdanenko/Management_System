import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NotesService } from './note.service';
import { NotesController } from './note.controller';

@Module({
  controllers: [NotesController],
  providers: [NotesService, PrismaService],
})
export class NotesModule {}
