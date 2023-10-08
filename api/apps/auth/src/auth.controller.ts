import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { Ctx } from '@nestjs/microservices/decorators';
import { RmqContext } from '@nestjs/microservices/ctx-host';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }

  @MessagePattern({ cmd: 'get-user' })
  async getUser(@Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef();
    const message = ctx.getMessage();
    channel.ack(message);

    return { channel, message };
  }
}
