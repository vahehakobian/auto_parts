import { NotFoundException } from '@nestjs/common';

export class VehiclePhotoNotFoundException extends NotFoundException {
  constructor() {
    super('error.vehicle_photo_not_found');
  }
}
