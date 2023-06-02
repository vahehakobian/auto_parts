import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _ from 'lodash';
import { Repository } from 'typeorm';

import type { PageDto } from '../../common/dto/page.dto';
import { RoleTypeEnum } from '../../constants';
import { VerifiedEnum } from '../../constants/verified-type.enum';
import type { UserRegisterDto } from '../auth/dto/user-register.dto';
import { UserNotFoundException } from '../auth/exceptions';
import type { UpdateUserDto } from './dto/update-user.dto';
import type { UserDto } from './dto/user.dto';
import type { UsersPageOptionsDto } from './dto/users-page-options.dto';
import { CanNotUpdateUser } from './exceptions/can-not-update-user.exception';
import { UserEntity } from './user.entity';
import { UserSettingsService } from './user-settings.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private userSettingsService: UserSettingsService,
  ) {}

  findOne(id: Uuid): Promise<UserEntity | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
  }

  async updateVerified(id: string, verified: VerifiedEnum) {
    await this.userRepository
      .createQueryBuilder('user')
      .update(UserEntity)
      .set({ isVerified: verified })
      .where('id = :id', { id })
      .execute();
  }

  async updatePassword(id: string, password: string) {
    await this.userRepository
      .createQueryBuilder('user')
      .update(UserEntity)
      .set({ password })
      .where('id = :id', { id })
      .execute();
  }

  async updateEmail(id: string, email: string) {
    await this.userRepository
      .createQueryBuilder('user')
      .update(UserEntity)
      .set({ email, isVerified: VerifiedEnum.PENDING })
      .where('id = :id', { id })
      .execute();
  }

  async findByUsernameOrEmail(
    options: Partial<{ username: string; email: string }>,
  ): Promise<UserEntity | null> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (options.email) {
      queryBuilder.orWhere('user.email = :email', {
        email: options.email,
      });
    }

    if (options.username) {
      queryBuilder.orWhere('user.username = :username', {
        username: options.username,
      });
    }

    return queryBuilder.getOne();
  }

  async getUserQuery(value: string, key: string): Promise<UserEntity | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .where(`user.${key} = :${key}`, { [key]: value })
      .getOne();
  }

  async usernameCheck(username: string): Promise<boolean> {
    const user = await this.getUserQuery(username, 'username');

    return user ? false : true;
  }

  async updateUserCheck(
    updateUserDto: UpdateUserDto,
  ): Promise<{ user1Id?: string; user2Id?: string }> {
    const user1 = await this.getUserQuery(updateUserDto.username, 'username');
    const user2 = await this.getUserQuery(updateUserDto.email, 'email');

    return { user1Id: user1?.id, user2Id: user2?.id };
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', {
        email,
      });

    return queryBuilder.getOne();
  }

  async createUser(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
    const user = this.userRepository.create({
      ...userRegisterDto,
      role: RoleTypeEnum.USER,
    });

    await this.userRepository.save(user);

    // if (!_.isEmpty(userRegisterDto.problemsList)) {
    //   user.settings = await this.userSettingsService.createUserSettings(
    //     user.id,
    //     userRegisterDto.problemsList,
    //   );
    // }

    return user;
  }

  async getUsers(
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getUser(userId: Uuid): Promise<UserDto> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.settings', 'userSettings')
      .leftJoinAndSelect('user.habits', 'habit')
      .where('user.id = :userId', { userId });

    const userEntity = await queryBuilder.getOne();

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    return userEntity.toDto();
  }

  async findById(userId: Uuid): Promise<UserEntity | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .getOne();
  }

  async getOne(userId: Uuid): Promise<UserEntity> {
    const entity = await this.findById(userId);

    if (!entity) {
      throw new UserNotFoundException();
    }

    return entity;
  }

  async updateUser(
    userId: Uuid,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    const entity = await this.getOne(userId);
    const result = await this.updateUserCheck(updateUserDto);

    if (Object.values(result).some((val) => Boolean(val))) {
      throw new CanNotUpdateUser();
    }

    this.userRepository.merge(entity, { ...updateUserDto });

    return (await this.userRepository.save(entity)).toDto();
  }

  async delete(userId: Uuid): Promise<void> {
    await this.userRepository
      .createQueryBuilder()
      .delete()
      .where('id = :userId', { userId })
      .execute();
  }
}
