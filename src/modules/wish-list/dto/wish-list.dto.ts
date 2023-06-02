import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { UserDto } from '../../user/dto/user.dto';
import { VehiclePartDto } from '../../vehicle-part/dto/vehicle-part.dto';
import type { WishListEntity } from '../wish-list.entity';

export class WishListDto extends AbstractDto {
  @ApiProperty()
  user: UserDto;

  @ApiProperty()
  vehicleParts: VehiclePartDto;

  constructor(wishListEntity: WishListEntity) {
    super(wishListEntity);
    this.user = wishListEntity.user;
    this.vehicleParts = wishListEntity.vehicleParts;
  }
}
