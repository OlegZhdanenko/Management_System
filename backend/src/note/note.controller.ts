import { Controller } from '@nestjs/common';

// import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { NoteService } from './note.service';

@Controller('notes')
export class NoteController {
  constructor(private readonly service: NoteService) {}

  //   @Post()
  //   @UseGuards(LocalAuthGuard)
  //   create(@Body() dto: CreateUserDto) {
  //     return this.service.create(dto);
  //   }
  //   @UseGuards(LocalAuthGuard)
  //   @Get()
  //   getAll() {
  //     return this.service.findAll();
  //   }
  //   @UseGuards(LocalAuthGuard)
  //   @Get(':id')
  //   @UseGuards(LocalAuthGuard)
  //   getById(@Param('id') id: string) {
  //     return this.service.findById(id);
  //   }
  //   @UseGuards(LocalAuthGuard)
  //   @Put(':id')
  //   update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
  //     return this.service.update(id, dto);
  //   }
  //   @UseGuards(LocalAuthGuard)
  //   @Delete(':id')
  //   delete(@Param('id') id: string) {
  //     return this.service.delete(id);
  //   }
}
