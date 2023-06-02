import { StringField } from '../../../decorators';

export class SocialLoginDto {
  @StringField()
  idToken: string;
}
