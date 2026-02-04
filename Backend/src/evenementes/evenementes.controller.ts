import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Req } from '@nestjs/common';
import { EvenementesService } from './evenementes.service';
import { CreateEvenementeDto } from './dto/create-evenemente.dto';
import { UpdateEvenementeDto } from './dto/update-evenemente.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'generated/prisma/enums';

@Controller('evenementes')
export class EvenementesController {
  constructor(private readonly evenementesService: EvenementesService) {}

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createEvenementeDto: CreateEvenementeDto, @Req() req) {
    return this.evenementesService.create(createEvenementeDto, req.user);
  }

  @Get()
  findAll() {
    return this.evenementesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.evenementesService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateEvenementeDto: UpdateEvenementeDto) {
    return this.evenementesService.update(+id, updateEvenementeDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.evenementesService.remove(+id);
  }
}
