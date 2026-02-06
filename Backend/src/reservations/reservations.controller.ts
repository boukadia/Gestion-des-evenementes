import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationStatusDto } from './dto/update-reservation.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'generated/prisma/enums';
import { User } from 'generated/prisma/client';

@Controller('reservations')
@UseGuards(JwtGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService,) {}

  @Post()
  create(@Body() createReservationDto: CreateReservationDto,@Req() req:any) {
    return this.reservationsService.create(createReservationDto,req.user);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findAll(@Req() req:any) {
    return this.reservationsService.findAll(req.user);
  }
  @Get('my')
  @UseGuards(RolesGuard)
  @Roles(Role.PARTICIPANT)
  findMyReservations(@Req() req:any) {
    return this.reservationsService.findMyReservations(req.user.id);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(+id);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() UpdateReservationStatusDto: UpdateReservationStatusDto, @Req() req:any) {
    return this.reservationsService.update(+id, UpdateReservationStatusDto,req.user);
  }

  @Patch(':id/annule')
  @UseGuards(RolesGuard)
  @Roles(Role.PARTICIPANT)
  remove(@Param('id') id: string, @Req() req:any) {
    return this.reservationsService.annule(+id,req.user);
  }
}
