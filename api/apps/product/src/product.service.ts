import { CreateProductDto, ProductEntity } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async getAllProducts() {
    return this.productRepository.find();
  }

  async createNewProduct(input: CreateProductDto) {
    const { userId, ...rest } = input;
    const newProduct = this.productRepository.create({
      ...rest,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await this.productRepository.save(newProduct);
  }
}
