import { Module, DynamicModule } from '@nestjs/common';
import { SharedService } from './shared.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AuthGuard } from './guards/role.guard';

@Module({
  providers: [SharedService, AuthGuard],
  exports: [SharedService, AuthGuard],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
  ],
})
export class SharedModule {
  static registerRmq(service: string, queue: string): DynamicModule {
    const provider = {
      provide: service,
      useFactory: (configService: ConfigService) => {
        const user = configService.get('RABBITMQ_DEFAULT_USER');
        const pass = configService.get('RABBITMQ_DEFAULT_PASS');
        const host = configService.get('RABBITMQ_HOST_DEV');

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
      inject: [ConfigService],
    };

    return {
      module: SharedModule,
      providers: [provider],
      exports: [provider],
    };
  }
}
