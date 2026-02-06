import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Req } from '@nestjs/common';
import { EvenementesService } from './evenementes.service';
import { CreateEvenementeDto } from './dto/create-evenemente.dto';
import { UpdateEvenementeDto } from './dto/update-evenemente.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'generated/prisma/enums';
import { ChangeStatusDto } from './dto/change-status.dto';

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

  @Get('published')
  findPublished() {
    return this.evenementesService.findPublished();
  }
  
  @Patch(':id/status')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  changeStatus(@Param('id') id: number, @Body() changeStatusDto:ChangeStatusDto) {
    return this.evenementesService.changeStatus(+id, changeStatusDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.evenementesService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: number, @Body() updateEvenementeDto: UpdateEvenementeDto) {
    return this.evenementesService.update(+id, updateEvenementeDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: number) {
    return this.evenementesService.remove(+id);
  }
}
