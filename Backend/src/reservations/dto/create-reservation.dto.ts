import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { ReservationStatus } from 'generated/prisma/enums';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsInt()
  eventId: number;

  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;
}
