import { StringField } from '../../../decorators/field.decorators';

export class CreateVehicleModelDto {
  @StringField()
  name: string;

  @StringField()
  brand: string;
}
