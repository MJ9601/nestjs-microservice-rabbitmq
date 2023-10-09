import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../typeorm/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        port: configService.get('POSTGRES_PORT'),
        database: configService.get('POSTGRES_DB'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        host: 'postgres_db',
        autoLoadEntities: true,
        synchronize: true,
        entities: [UserEntity],
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],

  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
