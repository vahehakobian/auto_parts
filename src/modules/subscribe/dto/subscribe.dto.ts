import { SubscribeStateType } from "../../../constants/subscribe-state-type.enum";
import { VehicleModelDto } from "modules/vehicle-models/dto/vehicle-model.dto";
import { AbstractDto } from "../../../common/dto/abstract.dto";
import { EnumField, NumberField, StringField } from "../../../decorators";
import type { UserDto } from "../../user/dto/user.dto";
import type { SubscribeEntity } from "../subscribe.entity";

export class SubscribeDto extends AbstractDto {
  @StringField()
  subscribe: string;

  @EnumField(() => SubscribeStateType)
  subscribeState: SubscribeStateType;

  @NumberField()
  yearFrom: number;

  @NumberField()
  yearTo: number;

  @NumberField()
  minPrice?: number;

  user: UserDto;

  model: VehicleModelDto;

  constructor(subscribeEntity: SubscribeEntity) {
    super(subscribeEntity);
    this.subscribe = subscribeEntity.subscribe;
    this.user = subscribeEntity.user;
    this.model = subscribeEntity.model;
    this.subscribeState = subscribeEntity.subscribeState;
    this.yearFrom = subscribeEntity.yearFrom;
    this.yearTo = subscribeEntity.yearTo;
    this.minPrice = subscribeEntity.minPrice;
  }
}
