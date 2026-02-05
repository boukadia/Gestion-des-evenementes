import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
// import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PrismaService } from 'src/prisma.service';
import { UpdateEvenementeDto } from 'src/evenementes/dto/update-evenemente.dto';
import { UpdateReservationStatusDto } from './dto/update-reservation.dto';
import { User } from 'generated/prisma/browser';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma:PrismaService){};

  async create(data: CreateReservationDto, user: User) {
    // console.log("data",data);
    // console.log("user",user);
    const evenement= await this.prisma.event.findUnique({
      where:{id:data.eventId}
    })
    if(!evenement){
      throw new NotFoundException('Event not found');
    }
     if (evenement.status!=="PUBLISHED") {
      throw new ForbiddenException('Event not available');
    }

     const currentReservations= await this.prisma.reservation.count(
      {
        where:{eventId:data.eventId,status:"CONFIRMED"}
      }
    )
    
    if (currentReservations >= evenement.capacity) {
      throw new BadRequestException('Event is full');
    }
    const existingReservation=await   this.prisma.reservation.findFirst({
      where:{
        eventId:data.eventId,
        userId:user.id,
        status: { in: ['PENDING', 'CONFIRMED'] }
      }
    })
    
    if(existingReservation){
      throw new BadRequestException('You have already reserved a spot for this event');
    }
    const reservation=await this.prisma.reservation.create({
      data:{
        eventId:data.eventId,
        userId:user.id
      }
    })

    return reservation ;
  }

  findAll() {
    return `This action returns all reservations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reservation`;
  }

  update(id: number, updateReservationDto: UpdateReservationStatusDto) {
    return `This action updates a #${id} reservation`;
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
