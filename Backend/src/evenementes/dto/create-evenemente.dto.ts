import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { EventStatus } from 'generated/prisma/enums';

export class CreateEvenementeDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  dateTime: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  capacity: number;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}
