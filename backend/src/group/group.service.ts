import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateGroupDto, userId: string) {
    return this.prisma.groups.create({
      data: {
        name: dto.name,
        createdBy: userId,
      },
    });
  }

  async findAll() {
    return this.prisma.groups.findMany({
      include: {
        creator: true,
        users: true,
      },
    });
  }

  async findOne(id: string) {
    const group = await this.prisma.groups.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            notes: true,
            groups: true,
          },
        },
        creator: true,
      },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return group;
  }

  async update(id: string, dto: UpdateGroupDto) {
    await this.findOne(id);

    return this.prisma.groups.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.groups.delete({ where: { id } });
  }
}
