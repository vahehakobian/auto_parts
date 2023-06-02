import { ForbiddenException } from '@nestjs/common';

export class ForgotPasswordForbbidenException extends ForbiddenException {
  constructor() {
    super('error.verifyYourAccount');
  }
}
