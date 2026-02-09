import { Injectable } from '@nestjs/common';
import { CreateEvenementeDto } from './dto/create-evenemente.dto';
import { UpdateEvenementeDto } from './dto/update-evenemente.dto';
import { PrismaService } from 'src/prisma.service';
import { User } from 'generated/prisma/client';
import { EventResponseDto } from './dto/event-response.dto';
import { plainToClass } from 'class-transformer';
import { ChangeStatusDto } from './dto/change-status.dto';

@Injectable()
export class EvenementesService {
  constructor(private readonly prisma: PrismaService){}
  async create(data: CreateEvenementeDto, user: User) {
    const { 
      title,
      description,
      dateTime,
      location,
      capacity
    } = data;
    
    const evenemente = await this.prisma.event.create({
      data: {
        title,
        description,
        dateTime,
        location,
        capacity,
        adminId: user.id,
      }
    });

    return plainToClass(EventResponseDto, evenemente, { excludeExtraneousValues: true });
  }

  async findAll() {
    const evenementes=await this.prisma.event.findMany();
    return evenementes;
    
  }

  async findPublished() {
    const events = await this.prisma.event.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { dateTime: 'asc' },
    });
    return events;
  }

  async changeStatus(id: number, changeStatusDto: ChangeStatusDto) {
    const evenemente = await this.prisma.event.update({
      where: { id },
      data: { status: changeStatusDto.status },
    });

    return plainToClass(EventResponseDto, evenemente, { excludeExtraneousValues: true });
  }
  

  async findOne(id: number) {
    const evenement= await this.prisma.event.findUnique({
      where: { id: id }
    });
    return evenement;
  }

  async update(id: number, data: UpdateEvenementeDto) {
   
    const updatedEvent= await this.prisma.event.update({
      where: { id: id },
      data: data
    })
    return updatedEvent;
  }

  async remove(id: number) {
    const deletedEvent= await this.prisma.event.delete({
      where:{ id: id }
    })
    return plainToClass(EventResponseDto, deletedEvent, { excludeExtraneousValues: true });
    
  }
}
