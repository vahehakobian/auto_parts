import { ApiProperty } from '@nestjs/swagger';

import { UserDto } from '../../user/dto/user.dto';

export class LoginPayloadDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty({ type: UserDto })
  user: UserDto;

  constructor(data: { accessToken: string; user: UserDto }) {
    this.accessToken = data.accessToken;
    this.user = data.user;
  }
}
