import { BadRequestException } from '@nestjs/common';

export class CanNotUpdateUser extends BadRequestException {
  constructor() {
    super('error.inputedCredentialsAreAlreadyExists');
  }
}
