import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { Ctx } from '@nestjs/microservices/decorators';
import { RmqContext } from '@nestjs/microservices/ctx-host';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'get-users' })
  async getUser(@Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef();
    const message = ctx.getMessage();
    channel.ack(message);

    return this.authService.getUsers();
  }

  @MessagePattern({ cmd: 'post-user' })
  async creatUser(@Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef();
    const originMsg = ctx.getMessage();
    const data = ctx.getPattern();
    const _data = ctx.getArgs();
    console.log(data, _data);
    channel.ack(originMsg);

    return this.authService.createUser({
      name: 'test',
      email: 'mail@mail.com',
      password: '0003',
    });
  }
}
