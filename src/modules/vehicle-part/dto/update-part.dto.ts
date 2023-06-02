import { bool } from "aws-sdk/clients/signer";

import { BodyTypeEnum } from "../../../constants/body-type.enum";
import { CategoryEnum } from "../../../constants/category-type.enum";
import { CurrencyTypeEnum } from "../../../constants/currency-type.enum";
import { CustomCleredEnum } from "../../../constants/custom-cleared-type.enum";
import { FuelTypeEnum } from "../../../constants/fuel-type.enum";
import {
  BooleanFieldOptional,
  EnumFieldOptional,
  NumberFieldOptional,
  StringFieldOptional,
} from "../../../decorators/field.decorators";

export class UpdateVehiclePartDto {
  @StringFieldOptional()
  modelId: Uuid;

  @StringFieldOptional()
  name: string;

  @EnumFieldOptional(() => CategoryEnum)
  category: CategoryEnum;

  @EnumFieldOptional(() => CustomCleredEnum)
  customCleared: CustomCleredEnum;

  @EnumFieldOptional(() => BodyTypeEnum)
  bodyType: BodyTypeEnum;

  @EnumFieldOptional(() => CurrencyTypeEnum)
  priceType: CurrencyTypeEnum;

  @BooleanFieldOptional({ default: false })
  paymentConditional: bool;

  @NumberFieldOptional()
  price?: number;

  @EnumFieldOptional(() => FuelTypeEnum)
  fuelType: FuelTypeEnum;

  @StringFieldOptional()
  milage: string;

  @StringFieldOptional()
  engine: string;

  @StringFieldOptional({ description: "maximum 1 keyword" })
  keyword: string;

  @StringFieldOptional()
  color?: string;

  @NumberFieldOptional()
  yearFrom: number;

  @NumberFieldOptional()
  yearTo: number;

  @StringFieldOptional()
  description?: string;
}
