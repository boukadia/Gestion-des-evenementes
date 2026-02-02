import { Module } from '@nestjs/common';
import { EvenementesService } from './evenementes.service';
import { EvenementesController } from './evenementes.controller';
import { PrismaModule } from 'src/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EvenementesController],
  providers: [EvenementesService],
})
export class EvenementesModule {}
