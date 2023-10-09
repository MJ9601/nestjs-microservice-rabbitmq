import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../typeorm/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/CreateUser.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getUsers() {
    return this.userRepository.find();
  }

  async createUser(input: CreateUserDto) {
    const newUser = this.userRepository.create({
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return await this.userRepository.save(newUser);
  }
}
