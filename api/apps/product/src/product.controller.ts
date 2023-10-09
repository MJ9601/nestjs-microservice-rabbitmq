import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { SharedService } from '@app/shared';

@Controller()
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: 'get-products' })
  async getUser(@Ctx() ctx: RmqContext) {
    this.sharedService.sendRmqAck(ctx);
    return this.productService.getAllProducts();
  }

  @MessagePattern({ cmd: 'post-product' })
  async creatUser(@Ctx() ctx: RmqContext) {
    this.sharedService.sendRmqAck(ctx);

    return this.productService.createNewProduct({
      name: 'test',
      description: 'this is a test description',
      price: 100,
      urlParam: 'test1',
      imageUrl: 'https://localhost:4000/public/img/first.png',
      userId: 1,
    });
  }
}
