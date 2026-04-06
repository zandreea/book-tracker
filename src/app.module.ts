import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt.guard';
import { BookClubsController } from './book-clubs/book-clubs.controller';
import { BookClubsService } from './book-clubs/book-clubs.service';
import { BookClubsModule } from './book-clubs/book-clubs.module';

@Module({
  providers: [
      AppService,
      {
        provide: APP_GUARD,
        useClass: JwtAuthGuard,
      },
      BookClubsService,
    ],  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule, 
    UsersModule, 
    AuthModule, BookClubsModule
  ],
  controllers: [AppController, BookClubsController],
})
export class AppModule {}