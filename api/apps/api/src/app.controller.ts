import { CreateProductDto, CreateUserDto, LoginDto } from '@app/shared';
import {
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Param,
  Res,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('PRODUCT_SERVICE') private readonly productService: ClientProxy,
  ) {}

  @Get('auth')
  async getUsers() {
    return this.authService.send(
      {
        cmd: 'getUsers',
      },
      {},
    );
  }

  @Post('auth/register')
  async createUser(@Body() input: CreateUserDto) {
    console.log(input);
    return this.authService.send(
      {
        cmd: 'registerUser',
      },
      input,
    );
  }

  @Post('auth/login')
  async login(
    @Body() input: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = this.authService.send(
      {
        cmd: 'login',
      },
      input,
    );

    console.log(token);
    return;
    // res.cookie("accessToken", token)
  }

  @Get('auth/users/:id')
  async getUserById(@Param('id') id: number) {
    return this.authService.send(
      {
        cmd: 'getUserById',
      },
      { id },
    );
  }

  @Delete('auth/users')
  async delUserById(@Body() input: LoginDto) {
    return this.authService.send(
      {
        cmd: 'delUserByHimself',
      },
      input,
    );
  }

  @Delete('auth/users/:id')
  async delUserByAdmin(@Param('id') id: number) {
    return this.authService.send(
      {
        cmd: 'delUserByAdmin',
      },
      { id },
    );
  }

  @Post('auth/users')
  async updateUserInfos(@Body() input: CreateUserDto) {
    return this.authService.send(
      {
        cmd: 'updateUserInfo',
      },
      input,
    );
  }

  @Delete('auth/delete/allUsers')
  async flushingUserCol() {
    return this.authService.send(
      {
        cmd: 'flushingUserColumn',
      },
      {},
    );
  }

  @Get('product')
  async getProducts() {
    return this.productService.send(
      {
        cmd: 'get-products',
      },
      {},
    );
  }

  @Post('product/:userId')
  async createProduct(
    @Body() input: Omit<CreateProductDto, 'userId'>,
    @Param('userId') userId: number,
  ) {
    return this.productService.send(
      {
        cmd: 'post-product',
      },
      { ...input, userId },
    );
  }
}
