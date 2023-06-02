import { NotFoundException } from '@nestjs/common';

export class VehicleModelNotFoundException extends NotFoundException {
  constructor() {
    super('error.model_not_found');
  }
}
