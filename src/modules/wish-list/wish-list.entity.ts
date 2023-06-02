import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { VehiclePartEntity } from '../vehicle-part/vehicle-part.entity';
import { WishListDto } from './dto/wish-list.dto';

@Entity({ name: 'wish_list' })
@UseDto(WishListDto)
export class WishListEntity extends AbstractEntity<WishListDto> {
  @ManyToOne(() => UserEntity, (userEntity) => userEntity.wishList, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(
    () => VehiclePartEntity,
    (vehiclePartEntity) => vehiclePartEntity.wishList,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'vehicle_id' })
  vehicleParts: VehiclePartEntity;
}
