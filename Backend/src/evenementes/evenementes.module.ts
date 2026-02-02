import { Module } from '@nestjs/common';
import { EvenementesService } from './evenementes.service';
import { EvenementesController } from './evenementes.controller';

@Module({
  controllers: [EvenementesController],
  providers: [EvenementesService],
})
export class EvenementesModule {}
