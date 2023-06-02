import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { Nullable } from '../../../types';
import type { UserSettingsEntity } from '../user-settings.entity';

export class UserSettingsDto extends AbstractDto {
  @ApiProperty({ type: String, isArray: true })
  problemsList: Nullable<string[]>;

  constructor(userSettingsEntity: UserSettingsEntity) {
    super(userSettingsEntity, { excludeFields: true });
    this.problemsList = userSettingsEntity.problemsList;
  }
}
