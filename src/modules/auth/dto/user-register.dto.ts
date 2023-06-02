import { IsPhoneNumber } from 'class-validator';

import { EmailField, PasswordField, StringField } from '../../../decorators';

export class UserRegisterDto {
  @StringField()
  fullName: string;

  @EmailField()
  email: string;

  @PasswordField()
  password: string;

  @IsPhoneNumber('AM')
  @StringField()
  phone: string;
}
