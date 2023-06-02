import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { TokenTypeEnum } from '../../../constants/token-type.enum';
import type { UserTokenEntity } from '../users-token.entity';

export class UserTokenDto extends AbstractDto {
  userId: string;

  token: string;

  type: TokenTypeEnum;

  constructor(userTokenEntity: UserTokenEntity) {
    super(userTokenEntity);

    this.userId = userTokenEntity.userId;
    this.token = userTokenEntity.token;
    this.type = userTokenEntity.type;
  }
}
