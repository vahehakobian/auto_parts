import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { CreateUserTokenDto } from './dto/create-user-token.dto';
import { UserTokenEntity } from './users-token.entity';

@Injectable()
export class UserTokenService {
  constructor(
    @InjectRepository(UserTokenEntity)
    private readonly userTokenRepository: Repository<UserTokenEntity>,
  ) {}

  async setToken(createUserTokenDto: CreateUserTokenDto): Promise<void> {
    const checkToken = await this.getByUserId(createUserTokenDto.userId);

    if (checkToken) {
      await this.userTokenRepository.update(checkToken.id, createUserTokenDto);

      return;
    }

    const token = this.userTokenRepository.create(createUserTokenDto);

    await this.userTokenRepository.save(token);
  }

  async getByUserId(id: Uuid) {
    const entity = await this.userTokenRepository
      .createQueryBuilder('user_token')
      .where('user_id = :id', { id })
      .getOne();

    return entity;
  }

  async getById(id: string) {
    const entity = await this.userTokenRepository
      .createQueryBuilder('user_token')
      .where('id = :id', { id })
      .getOne();

    return entity;
  }

  async delete(id: string): Promise<void> {
    await this.userTokenRepository
      .createQueryBuilder()
      .delete()
      .where('userId = :id', { id })
      .execute();
  }
}
