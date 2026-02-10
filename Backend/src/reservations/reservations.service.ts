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

    const canceledReservation = await this.prisma.reservation.findFirst({
      where: {
        eventId: data.eventId,
        userId: user.id,
        status: 'CANCELED'
      }
    });

    if (canceledReservation) {
      throw new BadRequestException('You have already reserved and canceled this event. Cannot reserve again.');
    }
    const reservation=await this.prisma.reservation.create({
      data:{
        eventId:data.eventId,
        userId:user.id
      }
    })

    return reservation ;
  }

  async findAll(user: User) {
    if (user.role !== "ADMIN") {
    throw new ForbiddenException('Only admin can update status');
  }
    const reservation= await  this.prisma.reservation.findMany({
      include:{event:true,user:true,ticket:true},
      orderBy: { createdAt: 'desc' }
    });
    return  reservation;
    
  }
  async findMyReservations(userId: number) {
    const reservations = await this.prisma.reservation.findMany({
      where: { userId },
           include:{event:true,user:true,ticket:true},

      orderBy: { createdAt: 'desc' }
    });
    return reservations;
  }


async findOne(id: number) {
  const reservation = await this.prisma.reservation.findUnique({
    where: { id },
         include:{event:true,user:true,ticket:true},

  });

  if (!reservation) {
    throw new NotFoundException('Reservation not found');
  }

  return reservation;
}


  async update(id: number, data: UpdateReservationStatusDto,user: User) {
    if (user.role !== "ADMIN") {
    throw new ForbiddenException('Only admin can update status');
  }
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
           include:{event:true,user:true,ticket:true},

    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }
    if (reservation.status === data.status) {
    throw new BadRequestException(`Reservation is already ${data.status}`);
  }
  
  if (reservation.status === 'CANCELED' && data.status === 'CONFIRMED') {
    throw new BadRequestException('Cannot confirm a canceled reservation');
  }

  if (reservation.status === "CONFIRMED") {
  throw new BadRequestException('Cannot cancel a confirmed reservation');
}

    console.log("data.status",data.status);
    console.log("reservation.status",reservation.status);
    
     if (data.status === 'CONFIRMED' && reservation.status === 'PENDING') {
    const currentReservations = await this.prisma.reservation.count({
      where: { 
        eventId: reservation.eventId, 
        status: "CONFIRMED"
      }
    });
     
    const event = await this.prisma.event.findUnique({
      where: { id: reservation.eventId },
    });

    if (!event) {
    throw new NotFoundException('Event not found');
  }
    
    if (currentReservations >= event.capacity) {
      throw new BadRequestException('Event is full');
    }
  }
  //generer  ticket
  if (data.status === 'CONFIRMED' && reservation.status === 'PENDING') {

  const pdfUrl = `tickets/ticket-${reservation.id}-${Date.now()}.pdf`;

  await this.prisma.ticket.create({
    data: {
      pdfUrl: pdfUrl,
      reservationId: reservation.id,
      userId: reservation.userId,
      eventId: reservation.eventId,
    },
  });
}



  // Update the reservation status
  const updatedReservation = await this.prisma.reservation.update({
    where: { id },
    data: { status:data.status },
  });

    return updatedReservation;
  }

  async annule(id: number,user: User) {
    const reservation=await this.prisma.reservation.findUnique({
      where:{id}
    });
    
    if(!reservation){
      throw new NotFoundException('Reservation not found');
    }
    if (reservation.userId!==user.id) {
      throw new ForbiddenException('You can only cancel your own reservations');
    }
    if(reservation.status==="CANCELED"){
      throw new BadRequestException('Reservation already canceled');
    }
    const resrvationDeleted=await this.prisma.reservation.update({
      where:{id},
      data:{status:"CANCELED"}
    })

    return resrvationDeleted ;
  }
}
