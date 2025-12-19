import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NotesService } from './note.service';
import { NotesController } from './note.controller';
import { CaslModule } from 'src/casl/casl.module';
import { NotesRepository } from './notes.repository';

@Module({
  imports: [CaslModule],
  controllers: [NotesController],
  providers: [NotesService, PrismaService, NotesRepository],
})
export class NotesModule {}
