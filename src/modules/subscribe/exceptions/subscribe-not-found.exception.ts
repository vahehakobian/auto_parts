import { NotFoundException } from '@nestjs/common';

export class SubscribeNotFoundException extends NotFoundException {
  constructor() {
    super('error.subscribe_not_found');
  }
}
