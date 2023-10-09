import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { Ctx } from '@nestjs/microservices/decorators';
import { RmqContext } from '@nestjs/microservices/ctx-host';
import { SharedService } from '@app/shared';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: 'get-users' })
  async getUser(@Ctx() ctx: RmqContext) {
    this.sharedService.sendRmqAck(ctx);
    return this.authService.getUsers();
  }

  @MessagePattern({ cmd: 'post-user' })
  async creatUser(@Ctx() ctx: RmqContext) {
    this.sharedService.sendRmqAck(ctx);

    return this.authService.createUser({
      name: 'test',
      email: 'mail@mail.com',
      password: '0003',
    });
  }
}
