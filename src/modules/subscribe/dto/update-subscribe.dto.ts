import { SubscribeStateType } from "../../../constants/subscribe-state-type.enum";
import { EnumFieldOptional, NumberFieldOptional, StringFieldOptional } from "../../../decorators";

export class UpdateSubscribeDto {
  @StringFieldOptional()
  subscribe: string;

  @StringFieldOptional()
  modelId: string;

  @EnumFieldOptional(() => SubscribeStateType)
  subscribeState: SubscribeStateType;

  @NumberFieldOptional()
  yearFrom: number;

  @NumberFieldOptional()
  yearTo: number;

  @NumberFieldOptional()
  minPrice?: number;
}
