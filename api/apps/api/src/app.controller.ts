import {
  CreateProductDto,
  CreateUserDto,
  GetUser,
  JwtGuard,
  LoginDto,
  RoleGuard,
  UserEntity,
} from '@app/shared';
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
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { Observable } from 'rxjs';

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
    return this.authService.send(
      {
        cmd: 'registerUser',
      },
      input,
    );
  }

  @Post('auth/login')
  async login(@Body() input: LoginDto) {
    const token = this.authService.send(
      {
        cmd: 'login',
      },
      input,
    );
    // console.log(token);

    // res.cookie('accessToken', token.accessToken, {
    //   httpOnly: true,
    //   sameSite: 'lax',
    //   maxAge: 9e5,
    //   secure: false,
    // });

    return token;
  }

  @Get('users/:id')
  async getUserById(@Param('id') id: number) {
    return this.authService.send(
      {
        cmd: 'getUserById',
      },
      { id },
    );
  }

  @Delete('users')
  @UseGuards(JwtGuard)
  async delUserById(@Body() input: LoginDto) {
    return this.authService.send(
      {
        cmd: 'delUserByHimself',
      },
      input,
    );
  }

  @Delete('users/:id')
  @UseGuards(JwtGuard, new RoleGuard(90))
  async delUserByAdmin(@Param('id') id: number) {
    return this.authService.send(
      {
        cmd: 'delUserByAdmin',
      },
      { id },
    );
  }

  @Post('users')
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

  @Get('auth/users/me')
  @UseGuards(JwtGuard)
  async getMe(@GetUser() user: Partial<UserEntity>) {
    return user;
  }

  @Post('product/:userId')
  @UseGuards(JwtGuard)
  async createProduct(
    @Body() input: Omit<CreateProductDto, 'userId'>,
    @GetUser() user: Partial<UserEntity>,
  ) {
    return this.productService.send(
      {
        cmd: 'post-product',
      },
      { ...input, userId: user.id },
    );
  }
}
