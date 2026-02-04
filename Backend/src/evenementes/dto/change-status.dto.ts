import { IsEnum, IsNotEmpty } from 'class-validator';
import { EventStatus } from 'generated/prisma/enums';

export class ChangeStatusDto {
  @IsNotEmpty()
  @IsEnum(EventStatus)
  status: EventStatus;
}
