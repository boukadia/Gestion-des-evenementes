import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { ReservationStatus } from 'generated/prisma/enums';

export class UpdateReservationDto {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsInt()
  eventId?: number;

  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;
}
