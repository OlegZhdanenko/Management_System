import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { CaslModule } from 'src/casl/casl.module';
import { MailModule } from 'src/mail/mail.module';
import { UserRepository } from './user.repository';

@Module({
  imports: [CaslModule, MailModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
