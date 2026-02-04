import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateTicketDto {
  @IsOptional()
  @IsString()
  pdfUrl?: string;

  @IsOptional()
  @IsInt()
  reservationId?: number;
}
