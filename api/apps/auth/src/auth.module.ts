import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../typeorm/entities/user.entity';
import { SharedModule, PostgresDBModule } from '@app/shared';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    PostgresDBModule,
    TypeOrmModule.forFeature([UserEntity]),
    SharedModule,
  ],

  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
