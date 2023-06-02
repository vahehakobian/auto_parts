import { bool } from "aws-sdk/clients/signer";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { AbstractEntity } from "../../common/abstract.entity";
import { BodyTypeEnum } from "../../constants/body-type.enum";
import { CategoryEnum } from "../../constants/category-type.enum";
import { CurrencyTypeEnum } from "../../constants/currency-type.enum";
import { CustomCleredEnum } from "../../constants/custom-cleared-type.enum";
import { FuelTypeEnum } from "../../constants/fuel-type.enum";
import { VerifiedEnum } from "../../constants/verified-type.enum";
import { UseDto } from "../../decorators";
import { UserEntity } from "../user/user.entity";
import { VehicleModelEntity } from "../vehicle-models/vehicle-model.entity";
import { WishListEntity } from "../wish-list/wish-list.entity";
import { VehiclePartDto } from "./dto/vehicle-part.dto";

@Entity({ name: "vehicle_part" })
@UseDto(VehiclePartDto)
export class VehiclePartEntity extends AbstractEntity<VehiclePartDto> {
  @Column({ type: "varchar", nullable: true })
  name: string;

  @Column({ type: "varchar", length: 15 })
  keyword: string;

  @Column({ type: "enum", enum: CategoryEnum })
  category: CategoryEnum;

  @Column({ type: "enum", enum: CustomCleredEnum })
  customCleared: CustomCleredEnum;

  @Column({ type: "enum", enum: BodyTypeEnum })
  bodyType: BodyTypeEnum;

  @Column({ type: "enum", enum: CurrencyTypeEnum })
  priceType: CurrencyTypeEnum;

  @Column({ type: "bool", nullable: true })
  paymentConditional: bool;

  @Column({ type: "integer", nullable: true })
  price?: number;

  @Column({ type: "enum", enum: FuelTypeEnum })
  fuelType: FuelTypeEnum;

  @Column({ type: "varchar" })
  milage: string;

  @Column({ type: "varchar" })
  engine: string;

  @Column({ type: "varchar" })
  color?: string;

  @Column({ type: "integer" })
  yearFrom: number;

  @Column({ type: "integer" })
  yearTo: number;

  @Column({ type: "integer", default: 0 })
  views: number;

  @Column({
    type: "enum",
    enum: VerifiedEnum,
    default: VerifiedEnum.PENDING,
  })
  isVerified: VerifiedEnum;

  @Column({ type: "text", nullable: true })
  description?: string;

  //   @OneToOne(
  //     () => VehicleDetailEntity,
  //     (vehicleDetailEntity) => vehicleDetailEntity.vehicle,
  //     { onDelete: 'CASCADE', onUpdate: 'CASCADE', cascade: true },
  //   )
  //   vehicleDetail: VehicleDetailEntity;

  @ManyToOne(
    () => VehicleModelEntity,
    (vehicleModelEntity) => vehicleModelEntity.vehicles,
    {
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    }
  )
  @JoinColumn({ name: "model_id" })
  model: VehicleModelEntity;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.vehicleParts, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @OneToMany(() => WishListEntity, (wishListEntity) => wishListEntity.user, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  wishList?: WishListEntity[];
  //   @OneToMany(
  //     () => VehiclePhotoEntity,
  //     (vehiclePhotoEntity) => vehiclePhotoEntity.vehicle,
  //     { onDelete: 'CASCADE', onUpdate: 'NO ACTION' },
  //   )
  //   photos: VehiclePhotoEntity[];
}
