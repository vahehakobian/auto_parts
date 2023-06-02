import { NotFoundException } from '@nestjs/common';

export class UserTokenFotFoundException extends NotFoundException {
  constructor() {
    super('error.user_token_not_found');
  }
}
