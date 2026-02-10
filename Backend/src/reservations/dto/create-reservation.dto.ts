import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateReservationDto {
  //   @IsNotEmpty()
  //   @IsInt()
  //   userId: number;

  @IsNotEmpty()
  @IsInt()
  eventId: number;

  //   @IsOptional()
  //   @IsEnum(ReservationStatus)
  //   status?: ReservationStatus;
}
