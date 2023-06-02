import { AbstractDto } from '../../../common/dto/abstract.dto';
import { RoleTypeEnum } from '../../../constants';
import { VerifiedEnum } from '../../../constants/verified-type.enum';
import {
  EnumField,
  StringField,
  StringFieldOptional,
} from '../../../decorators';
import type { UserEntity } from '../user.entity';

export class UserDto extends AbstractDto {
  @StringField()
  fullName: string;

  @EnumField(() => RoleTypeEnum)
  role: RoleTypeEnum;

  @StringField()
  email: string;

  @StringFieldOptional()
  phone: string;

  @StringFieldOptional()
  avatar?: string;

  @StringFieldOptional()
  viber?: string;

  @StringFieldOptional()
  whatsapp?: string;

  @EnumField(() => VerifiedEnum)
  isVerified: VerifiedEnum;

  constructor(user: UserEntity) {
    super(user);
    this.fullName = user.fullName;
    this.role = user.role;
    this.email = user.email;
    this.phone = user.phone;
    this.avatar = user.avatar;
    this.viber = user.viber;
    this.whatsapp = user.whatsapp;
  }
}
