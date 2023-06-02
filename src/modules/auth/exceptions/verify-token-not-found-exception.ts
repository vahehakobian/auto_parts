import { NotFoundException } from '@nestjs/common';

export class TokenNotFoundException extends NotFoundException {
  constructor() {
    super('error.tokenNotFound');
  }
}
