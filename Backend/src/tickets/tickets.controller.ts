import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'generated/prisma/enums';
import type { Response } from 'express';
import * as path from 'path';

@Controller('tickets')
@UseGuards(JwtGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService,
    private readonly reservationsService: TicketsService
  ) {}

  // @Post()
  // create(@Body() createTicketDto: CreateTicketDto) {
  //   return this.ticketsService.create(createTicketDto);
  // }
  @Get('my')
  findMyTickets(@Req() req:any) {
    return this.ticketsService.findMyTickets(req.user);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.ticketsService.findAll();
  }
  


  @Get(':id')
  findOne(@Param('id') id: string,@Req() req:any) {
    return this.ticketsService.findOne(+id,req.user);
  }

  @Get(':id/download')
  async downloadTicket(
    @Param('id') id: string,
    @Req() req: any,
    @Res() res: Response
  ) {
    const isAdmin = req.user.role === Role.ADMIN;
    const pdfPath = await this.ticketsService.getTicketPdfPath(+id, req.user, isAdmin);
    const fileName = `ticket-${id}.pdf`;
    
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    // PDF headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    res.sendFile(path.resolve(pdfPath));
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
  //   return this.ticketsService.update(+id, updateTicketDto);
  // }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }
 
}
