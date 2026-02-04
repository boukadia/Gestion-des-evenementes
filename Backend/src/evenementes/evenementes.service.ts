import { Injectable } from '@nestjs/common';
import { CreateEvenementeDto } from './dto/create-evenemente.dto';
import { UpdateEvenementeDto } from './dto/update-evenemente.dto';
import { PrismaService } from 'src/prisma.service';
import { User } from 'generated/prisma/client';
import { EventResponseDto } from './dto/event-response.dto';
import { plainToClass } from 'class-transformer';

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
        dateTime: new Date(dateTime),
        location,
        capacity,
        adminId: user.id,
      }
    });

    return plainToClass(EventResponseDto, evenemente, { excludeExtraneousValues: true });
  }

  findAll() {
    const evenementes=this.prisma.event.findMany();
    return evenementes;
    
  }

  findOne(id: number) {
    return `This action returns a #${id} evenemente`;
  }

  update(id: number, updateEvenementeDto: UpdateEvenementeDto) {
    return `This action updates a #${id} evenemente`;
  }

  remove(id: number) {
    return `This action removes a #${id} evenemente`;
  }
}
