import { bool } from "aws-sdk/clients/signer";

import { BodyTypeEnum } from "../../../constants/body-type.enum";
import { CategoryEnum } from "../../../constants/category-type.enum";
import { CurrencyTypeEnum } from "../../../constants/currency-type.enum";
import { CustomCleredEnum } from "../../../constants/custom-cleared-type.enum";
import { FuelTypeEnum } from "../../../constants/fuel-type.enum";
import {
  BooleanFieldOptional,
  EnumField,
  NumberField,
  NumberFieldOptional,
  StringField,
  StringFieldOptional,
} from "../../../decorators/field.decorators";

export class CreateVehiclePartDto {
  @StringField()
  modelId: Uuid;

  @StringField()
  name: string;

  @EnumField(() => CategoryEnum)
  category: CategoryEnum;

  @EnumField(() => CustomCleredEnum)
  customCleared: CustomCleredEnum;

  @EnumField(() => BodyTypeEnum)
  bodyType: BodyTypeEnum;

  @EnumField(() => CurrencyTypeEnum)
  priceType: CurrencyTypeEnum;

  @BooleanFieldOptional({ default: false })
  paymentConditional: bool;

  @NumberFieldOptional()
  price?: number;

  @EnumField(() => FuelTypeEnum)
  fuelType: FuelTypeEnum;

  @StringField()
  milage: string;

  @StringField()
  engine: string;

  @StringField({ description: "maximum 1 keyword" })
  keyword: string;

  @StringFieldOptional()
  color?: string;

  @NumberField()
  yearFrom: number;

  @NumberField()
  yearTo: number;

  @StringFieldOptional()
  description?: string;
}
