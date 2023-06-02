import { ApiPropertyOptional } from '@nestjs/swagger';
import { EmailFieldOptional, StringFieldOptional } from '../../../decorators';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @StringFieldOptional({ minLength: 2, maxLength: 36 })
  username: string;

  @ApiPropertyOptional()
  @EmailFieldOptional()
  email: string;
}
