import { Column, Entity, Index, Unique } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { TokenTypeEnum } from '../../constants/token-type.enum';
import { UseDto } from '../../decorators';
import { UserTokenDto } from './dto/users-token.dto';

@Entity('users_tokens')
@Unique(['userId', 'type'])
@UseDto(UserTokenDto)
export class UserTokenEntity extends AbstractEntity<UserTokenDto> {
  @Column()
  userId: Uuid;

  @Column({ unique: true })
  @Index()
  token: string;

  @Column({ type: 'enum', enum: TokenTypeEnum })
  type: TokenTypeEnum;
}
