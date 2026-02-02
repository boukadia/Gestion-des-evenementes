import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EvenementesService } from './evenementes.service';
import { CreateEvenementeDto } from './dto/create-evenemente.dto';
import { UpdateEvenementeDto } from './dto/update-evenemente.dto';

@Controller('evenementes')
export class EvenementesController {
  constructor(private readonly evenementesService: EvenementesService) {}

  @Post()
  create(@Body() createEvenementeDto: CreateEvenementeDto) {
    return this.evenementesService.create(createEvenementeDto);
  }

  @Get()
  findAll() {
    return this.evenementesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.evenementesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEvenementeDto: UpdateEvenementeDto) {
    return this.evenementesService.update(+id, updateEvenementeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.evenementesService.remove(+id);
  }
}
