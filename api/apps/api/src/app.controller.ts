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
import { CreateUserDto } from 'apps/auth/dtos/CreateUser.dto';
import { CreateProductDto } from 'apps/product/dtos/createProduct.dtc';

@Controller('api')
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('PRODUCT_SERVICE') private readonly productService: ClientProxy,
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
  async createUser(@Body() input: CreateUserDto) {
    return this.authService.send(
      {
        cmd: 'post-user',
      },
      input,
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

  @Post('product')
  async createProduct(@Body() input: CreateProductDto) {
    return this.productService.send(
      {
        cmd: 'post-product',
      },
      input,
    );
  }
}
