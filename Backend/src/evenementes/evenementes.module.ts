import { Module } from '@nestjs/common';
import { EvenementesService } from './evenementes.service';
import { EvenementesController } from './evenementes.controller';
import { PrismaModule } from 'src/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule],
  controllers: [EvenementesController],
  providers: [EvenementesService],
})
export class EvenementesModule {}
