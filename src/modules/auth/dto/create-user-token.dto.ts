import type { TokenTypeEnum } from '../../../constants/token-type.enum';

export class CreateUserTokenDto {
  userId: Uuid;

  token: string;

  type: TokenTypeEnum;
}
