import { AbstractDto } from '../../../common/dto/abstract.dto';
import { StringField } from '../../../decorators';
import type { VehicleModelDto } from '../../vehicle-models/dto/vehicle-model.dto';
import type { VehicleBrandEntity } from '../vehicle-brand.entity';

export class VehicleBrandDto extends AbstractDto {
  @StringField()
  name: string;

  models: VehicleModelDto[];

  constructor(vehicleBrandEntity: VehicleBrandEntity) {
    super(vehicleBrandEntity);
    this.name = vehicleBrandEntity.name;
    this.models = vehicleBrandEntity.models?.toDtos();
  }
}
