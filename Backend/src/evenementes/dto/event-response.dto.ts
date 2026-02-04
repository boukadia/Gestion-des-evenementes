import { Exclude, Expose } from 'class-transformer';
import { EventStatus } from 'generated/prisma/enums';

export class EventResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  dateTime: Date;

  @Expose()
  location: string;

  @Expose()
  capacity: number;

  @Expose()
  status: EventStatus;

  @Expose()
  createdAt: Date;

  @Exclude()
  adminId: number;

  constructor(partial: Partial<EventResponseDto>) {
    Object.assign(this, partial);
  }
}
