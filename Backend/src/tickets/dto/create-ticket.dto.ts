import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsString()
  pdfUrl: string;

  @IsNotEmpty()
  @IsInt()
  reservationId: number;
}
