import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { EmailField } from '../../../decorators';

export class UserLoginDto {
  @EmailField()
  email: string;

  @IsString()
  @ApiProperty()
  password: string;
}
