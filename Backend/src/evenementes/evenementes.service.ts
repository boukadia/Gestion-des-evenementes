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
        dateTime: new Date(dateTime),
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
  async changeStatus(id: number, changeStatusDto: ChangeStatusDto) {
    const evenemente = await this.prisma.event.update({
      where: { id },
      data: { status: changeStatusDto.status },
    });

    return plainToClass(EventResponseDto, evenemente, { excludeExtraneousValues: true });
  }
  

  findOne(id: number) {
    return `This action returns a #${id} evenemente`;
  }

  update(id: number, updateEvenementeDto: UpdateEvenementeDto) {
    return `This action updates a #${id} evenemente`;
  }

  async remove(id: number) {
    const deletedEvent= await this.prisma.event.delete({
      where:{id}
    })
    return plainToClass(EventResponseDto, deletedEvent, { excludeExtraneousValues: true });
    
  }
}
