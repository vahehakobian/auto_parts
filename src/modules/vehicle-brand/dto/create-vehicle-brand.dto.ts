import { StringField } from '../../../decorators/field.decorators';

export class CreateVehicleBrandDto {
  @StringField()
  name: string;
}
