import { SubscribeEntity } from '../subscribe/subscribe.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { VehicleBrandEntity } from '../vehicle-brand/vehicle-brand.entity';
import { VehiclePartEntity } from '../vehicle-part/vehicle-part.entity';
import { VehicleModelDto } from './dto/vehicle-model.dto';

@Entity({ name: 'vehicle_model' })
@UseDto(VehicleModelDto)
@Unique(['name'])
export class VehicleModelEntity extends AbstractEntity<VehicleModelDto> {
  @Column({ type: 'varchar' })
  name: string;

  @ManyToOne(
    () => VehicleBrandEntity,
    (vehiclebrandEntity) => vehiclebrandEntity.models,
  )
  @JoinColumn({ name: 'brand_id' })
  brand: VehicleBrandEntity;

  @OneToMany(
    () => VehiclePartEntity,
    (vehiclePartEntity) => vehiclePartEntity.model,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    },
  )
  vehicles: VehiclePartEntity[];

  @OneToMany(
    () => SubscribeEntity,
    (subscribeEntity) => subscribeEntity.model,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    },
  )
  subscribes: SubscribeEntity[];
}
