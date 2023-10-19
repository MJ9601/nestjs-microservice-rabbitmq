import {
  Controller,
  HttpException,
  HttpStatus,
  ConflictException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { Ctx, Payload } from '@nestjs/microservices/decorators';
import { RmqContext } from '@nestjs/microservices/ctx-host';
import { CreateUserDto, SharedService, LoginDto } from '@app/shared';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: 'getUsers' })
  async getUser(@Ctx() ctx: RmqContext) {
    try {
      this.sharedService.sendRmqAck(ctx);
      return this.authService.getUsers();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @MessagePattern({ cmd: 'registerUser' })
  async creatUser(@Ctx() ctx: RmqContext, @Payload() payload: CreateUserDto) {
    try {
      this.sharedService.sendRmqAck(ctx);

      console.log(payload);

      const newUser = await this.authService.createUser(payload);

      if (!newUser) throw new ConflictException('Invalid Email or Password!!');

      return newUser;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @MessagePattern({ cmd: 'login' })
  async loginUser(@Ctx() ctx: RmqContext, @Payload() payload: LoginDto) {
    try {
      this.sharedService.sendRmqAck(ctx);

      return this.authService.varifiedUserInfo(payload);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @MessagePattern({ cmd: 'getUserById' })
  async getUserById(
    @Ctx() ctx: RmqContext,
    @Payload() payload: { id: number },
  ) {
    try {
      this.sharedService.sendRmqAck(ctx);

      return this.authService.getUserById(payload.id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @MessagePattern({ cmd: 'delUserByHimself' })
  async removeUserByHimself(
    @Ctx() ctx: RmqContext,
    @Payload() payload: LoginDto,
  ) {
    try {
      this.sharedService.sendRmqAck(ctx);

      return this.authService.delUserByHimself(payload);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @MessagePattern({ cmd: 'delUserByAmin' })
  async removeUserByAdmin(
    @Ctx() ctx: RmqContext,
    @Payload() payload: { id: number },
  ) {
    try {
      this.sharedService.sendRmqAck(ctx);

      return this.authService.delUserByAdmin(payload.id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @MessagePattern({ cmd: 'updateUserInfo' })
  async updateUserInfo(
    @Ctx() ctx: RmqContext,
    @Payload() payload: CreateUserDto,
  ) {
    try {
      this.sharedService.sendRmqAck(ctx);

      return this.authService.updateUserByHimself(payload);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @MessagePattern({ cmd: 'flushingUserColumn' })
  async flushingUserCol(@Ctx() ctx: RmqContext) {
    try {
      this.sharedService.sendRmqAck(ctx);

      const del = await this.authService.flushingUserColumn();

      return { succeeded: del };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
