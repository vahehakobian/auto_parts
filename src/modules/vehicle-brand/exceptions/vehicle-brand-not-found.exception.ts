import { NotFoundException } from '@nestjs/common';

export class VehicleBrandNotFoundException extends NotFoundException {
  constructor() {
    super('error.vehicle_brand_not_found');
  }
}
