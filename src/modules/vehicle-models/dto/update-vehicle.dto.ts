import { StringFieldOptional } from '../../../decorators';

export class UpdateVehicleModelDto {
  @StringFieldOptional()
  name: string;

  @StringFieldOptional()
  brand: string;
}
