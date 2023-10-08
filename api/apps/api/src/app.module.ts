import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices/client';
import { Transport } from '@nestjs/microservices/enums';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: './env' })],
  controllers: [],
  providers: [
    {
      provide: 'AUTH_SERVICE',
      useFactory: (configService: ConfigService) => {
        const user = configService.get('RABBITMQ_USER');
        const pass = configService.get('RABBITMQ_PASS');
        const host = configService.get('RABBITMQ_HOST');
        const queue = configService.get('RABBITMQ_AUTH_QUEUE');

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${user}:${pass}@${host}`],
            queue,
            queueOptions: {
              durable: true,
            },
          },
        });
      },
    },
  ],
})
export class AppModule {}
