import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { GroupsController } from './group.controller';
import { GroupsService } from './group.service';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService, PrismaService],
  exports: [GroupsService],
})
export class GroupModule {}
