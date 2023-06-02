import { VehicleModelEntity } from "../vehicle-models/vehicle-model.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { AbstractEntity } from "../../common/abstract.entity";
import { UseDto } from "../../decorators";
import { UserEntity } from "../user/user.entity";
import { SubscribeDto } from "./dto/subscribe.dto";
import { SubscribeStateType } from "../../constants/subscribe-state-type.enum";

@Entity({ name: "subscribe" })
@UseDto(SubscribeDto)
export class SubscribeEntity extends AbstractEntity<SubscribeDto> {
  @Column({ type: "varchar" })
  subscribe: string;

  @Column({
    type: "enum",
    enum: SubscribeStateType,
    default: SubscribeStateType.ACTIVE,
  })
  subscribeState: SubscribeStateType;

  @Column({ type: "integer" })
  yearFrom: number;

  @Column({ type: "integer" })
  yearTo: number;

  @Column({ type: "integer", nullable: true, default: 0 })
  minPrice?: number;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.subscribes, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @ManyToOne(() => VehicleModelEntity, (modelEntity) => modelEntity.subscribes)
  @JoinColumn({ name: "model_id" })
  model: VehicleModelEntity;
}
