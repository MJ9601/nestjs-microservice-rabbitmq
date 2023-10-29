import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class SharedService {
  constructor(private readonly configService: ConfigService) {}

  getRmqOptions(queue: string): RmqOptions {
    const user = this.configService.get('RABBITMQ_DEFAULT_USER');
    const pass = this.configService.get('RABBITMQ_DEFAULT_PASS');
    const host = this.configService.get('RABBITMQ_HOST_DEV');
    return {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${user}:${pass}@${host}`],
        noAck: false,
        queue,
        queueOptions: {
          durable: true,
        },
      },
    };
  }

  sendRmqAck(ctx: RmqContext) {
    const channel = ctx.getChannelRef();
    const originMsg = ctx.getMessage();
    channel.ack(originMsg);
  }
}
