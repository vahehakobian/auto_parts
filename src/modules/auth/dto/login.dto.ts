import { PasswordField, StringField } from '../../../decorators';

export class LoginDto {
  @StringField()
  readonly login: string;

  @PasswordField()
  readonly password: string;
}
