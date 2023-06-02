import { EmailField } from '../../../decorators';

export class SendUpdatePasswordEmailDto {
  @EmailField()
  email: string;
}
