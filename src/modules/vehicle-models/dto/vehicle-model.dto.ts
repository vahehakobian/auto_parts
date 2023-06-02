import { AbstractDto } from '../../../common/dto/abstract.dto';
import { StringField } from '../../../decorators';
import type { VehicleBrandDto } from '../../vehicle-brand/dto/vehicle-brand.dto';
import type { VehicleModelEntity } from '../vehicle-model.entity';

export class VehicleModelDto extends AbstractDto {
  @StringField()
  name: string;

  brand: VehicleBrandDto;

  constructor(vehicleModelEntity: VehicleModelEntity) {
    super(vehicleModelEntity);
    this.name = vehicleModelEntity.name;
    this.brand = vehicleModelEntity.brand?.toDto();
  }
}
