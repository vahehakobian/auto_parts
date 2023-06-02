import { NotFoundException } from '@nestjs/common';

export class VehiclePartNotFoundException extends NotFoundException {
  constructor() {
    super('error.vehicle_part_not_found');
  }
}
