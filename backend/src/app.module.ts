import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GroupModule } from './group/group.module';
import { NoteModule } from './note/note.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, GroupModule, NoteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
