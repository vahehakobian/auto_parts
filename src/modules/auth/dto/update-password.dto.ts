import { PasswordField } from '../../../decorators';

export class UpdatePasswordDto {
  @PasswordField()
  password: string;
}
