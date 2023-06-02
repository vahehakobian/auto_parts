import { ApiProperty } from '@nestjs/swagger';

import { Nullable } from '../../../types';

export class CreateUserSettingsDto {
  @ApiProperty({ type: String, isArray: true })
  problemsList: Nullable<string[]>;
}
