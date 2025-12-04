import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';

@Module({
  controllers: [NoteController],
  providers: [NoteService, PrismaService],
  exports: [NoteService],
})
export class NoteModule {}
