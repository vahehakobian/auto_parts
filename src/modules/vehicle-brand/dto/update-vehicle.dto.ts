import { PartialType } from '@nestjs/mapped-types';

import { CreateVehicleBrandDto } from './create-vehicle-brand.dto';

export class UpdateVehicleBrandDto extends PartialType(CreateVehicleBrandDto) {}
