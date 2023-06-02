import { Column, Entity, OneToMany, Unique } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { VehicleModelEntity } from '../vehicle-models/vehicle-model.entity';
import { VehicleBrandDto } from './dto/vehicle-brand.dto';

@Entity({ name: 'vehicle_brand' })
@UseDto(VehicleBrandDto)
@Unique(['name'])
export class VehicleBrandEntity extends AbstractEntity<VehicleBrandDto> {
  @Column({ type: 'varchar' })
  name: string;

  @OneToMany(
    () => VehicleModelEntity,
    (vehicleModelEntity) => vehicleModelEntity.brand,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  models: VehicleModelEntity[];
}
