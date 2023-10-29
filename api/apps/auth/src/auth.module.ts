import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule, PostgresDBModule, UserEntity } from '@app/shared';
import { JwtModule } from '@nestjs/jwt/dist';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    PostgresDBModule,
    TypeOrmModule.forFeature([UserEntity]),
    SharedModule,
    JwtModule.register({}),
  ],

  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
