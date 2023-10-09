import {
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Delete,
  Body,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('api')
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  @Get('auth')
  async getUsers() {
    return this.authService.send(
      {
        cmd: 'get-users',
      },
      {},
    );
  }

  @Post('auth')
  async createUser(@Body() input: any) {
    return this.authService.send(
      {
        cmd: 'post-user',
      },
      input,
    );
  }
}
