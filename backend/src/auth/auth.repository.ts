import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

import { RegisterDto } from './dto.ts/register.dto';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  create(data: RegisterDto) {
    return this.prisma.user.create({ data });
  }

  updateByEmail(email: string) {
    return this.prisma.user.update({
      where: { email },
      data: { token: null },
    });
  }

  updateById(
    id: string,
    data: { verify: boolean; verifyToken: string | null },
  ) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
