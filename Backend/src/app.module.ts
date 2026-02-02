import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EvenementesModule } from './evenementes/evenementes.module';
import { ReservationsModule } from './reservations/reservations.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [UserModule, AuthModule, UsersModule, EvenementesModule, ReservationsModule, TicketsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
