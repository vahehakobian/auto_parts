import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { UserSettingsEntity } from './user-settings.entity';
import { UserSettingsService } from './user-settings.service';

export const handlers = [];

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserSettingsEntity])],
  controllers: [UserController],
  exports: [UserService, UserSettingsService, TypeOrmModule],
  providers: [UserService, UserSettingsService, ...handlers],
})
export class UserModule {}
