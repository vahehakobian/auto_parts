import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// import type { CreateUserSettingsDto } from './dto/create-user-settings.dto';
import { UserSettingsEntity } from './user-settings.entity';

@Injectable()
export class UserSettingsService {
  constructor(
    @InjectRepository(UserSettingsEntity)
    private userSettingsRepository: Repository<UserSettingsEntity>,
  ) {}

  async createUserSettings(
    userId: Uuid,
    problemsList?: string[],
  ): Promise<UserSettingsEntity> {
    const settings = this.userSettingsRepository.create({
      userId,
      problemsList,
    });

    return this.userSettingsRepository.save(settings);
  }
}
