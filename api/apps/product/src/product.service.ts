import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../typeorm/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../dtos/createProduct.dtc';

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
