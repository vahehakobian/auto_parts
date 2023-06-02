import { Column, Entity, OneToMany, Unique } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { RoleTypeEnum } from '../../constants';
import { VerifiedEnum } from '../../constants/verified-type.enum';
import { UseDto } from '../../decorators/use-dto.decorator';
import { SubscribeEntity } from '../subscribe/subscribe.entity';
import { VehiclePartEntity } from '../vehicle-part/vehicle-part.entity';
import { WishListEntity } from '../wish-list/wish-list.entity';
import { UserDto } from './dto/user.dto';

@Entity({ name: 'users' })
@UseDto(UserDto)
@Unique(['email'])
export class UserEntity extends AbstractEntity<UserDto> {
  @Column({ type: 'varchar' })
  fullName: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar' })
  phone: string;

  @Column({ type: 'varchar', nullable: true })
  avatar: string;

  @Column({ type: 'varchar', nullable: true })
  viber: string;

  @Column({ type: 'varchar', nullable: true })
  whatsapp: string;

  @Column({ enum: RoleTypeEnum, type: 'enum' })
  role: RoleTypeEnum;

  @Column({
    type: 'enum',
    enum: VerifiedEnum,
    default: VerifiedEnum.PENDING,
  })
  isVerified: VerifiedEnum;

  @OneToMany(() => WishListEntity, (wishListEntity) => wishListEntity.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  wishList?: WishListEntity[];

  @OneToMany(
    () => VehiclePartEntity,
    (vehiclePartEntity) => vehiclePartEntity.user,
  )
  vehicleParts: VehiclePartEntity[];

  @OneToMany(() => SubscribeEntity, (subscribeEntity) => subscribeEntity.user)
  subscribes: SubscribeEntity[];
}
