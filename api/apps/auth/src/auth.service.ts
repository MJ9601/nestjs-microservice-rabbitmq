import { CreateUserDto, UserEntity, LoginDto } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon from 'argon2';
import { omit } from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getUsers() {
    return this.userRepository.find();
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async getUserById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async createUser(input: CreateUserDto) {
    const user = await this.getUserByEmail(input.email);
    if (user) return false;

    const { password, ...rest } = input;
    const hash = await argon.hash(password);

    const newUser = this.userRepository.create({
      ...rest,
      password: hash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const savedUser = await this.userRepository.save(newUser);
    return omit(savedUser, 'password');
  }

  async varifiedUserInfo(
    input: LoginDto,
  ): Promise<false | Omit<UserEntity, 'password'>> {
    const user = await this.getUserByEmail(input.email);
    if (!user) return false;

    const validated = await argon.verify(user.password, input.password);

    return validated ? omit(user, 'password') : false;
  }

  async handleLoginProccess(input: LoginDto) {
    const user = await this.varifiedUserInfo(input);
    if (!user) return false;

    const accessToken = await this.jwtService.signAsync(
      { ...user, valid: true },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '1d',
      },
    );

    return { accessToken };
  }

  async delUserByHimself(input: LoginDto) {
    const user = await this.varifiedUserInfo(input);
    if (!user) return false;

    const delUser = await this.userRepository.delete({ id: user.id });

    return true;
  }

  async delUserByAdmin(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) return false;

    const delUser = await this.userRepository.delete({ id: user.id });

    return true;
  }

  async updateUserByHimself(input: CreateUserDto) {
    const { email, password, ...rest } = input;
    const user = await this.varifiedUserInfo({ email, password });
    if (!user) return false;

    await this.userRepository.update({ id: user.id }, rest);

    return await this.getUserById(user.id);
  }

  async flushingUserColumn() {
    const users = await this.getUsers();

    await Promise.all(
      users.map(async (user) => this.userRepository.delete({ id: user.id })),
    );

    return true;
  }
}
