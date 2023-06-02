import { BadRequestException } from '@nestjs/common';

export class UserDeviceTokensNotFoundException extends BadRequestException {
  constructor() {
    super('error.userDeviceTokensNotFoundException');
  }
}
