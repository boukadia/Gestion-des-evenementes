import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User } from 'generated/prisma/browser';
import * as puppeteer from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.ticket.findMany({
      include: {
        user: true,
        event: true,
        reservation: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findMyTickets(user: User) {
    return this.prisma.ticket.findMany({
      where: {
        userId: user.id,
      },
      include: {
        event: true,
        reservation: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number, user: User, isAdmin = false) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        event: true,
        reservation: true,
        user: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (!isAdmin && ticket.userId !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    return ticket;
  }

  
  
}
