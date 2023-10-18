import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateProductDto, SharedService } from '@app/shared';

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
  async creatUser(
    @Ctx() ctx: RmqContext,
    @Payload() payload: CreateProductDto,
  ) {
    this.sharedService.sendRmqAck(ctx);

    return this.productService.createNewProduct(payload);
  }
}
