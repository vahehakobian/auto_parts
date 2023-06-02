import { bool } from "aws-sdk/clients/signer";
import { VehicleModelDto } from "modules/vehicle-models/dto/vehicle-model.dto";

import { AbstractDto } from "../../../common/dto/abstract.dto";
import { BodyTypeEnum } from "../../../constants/body-type.enum";
import { CategoryEnum } from "../../../constants/category-type.enum";
import { CurrencyTypeEnum } from "../../../constants/currency-type.enum";
import { CustomCleredEnum } from "../../../constants/custom-cleared-type.enum";
import { FuelTypeEnum } from "../../../constants/fuel-type.enum";
import { VerifiedEnum } from "../../../constants/verified-type.enum";
import {
  BooleanFieldOptional,
  EnumField,
  NumberField,
  NumberFieldOptional,
  StringField,
  StringFieldOptional,
} from "../../../decorators/field.decorators";
import type { UserDto } from "../../user/dto/user.dto";
import type { VehiclePartEntity } from "../vehicle-part.entity";

export class VehiclePartDto extends AbstractDto {
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

  @BooleanFieldOptional()
  paymentConditional: bool;

  @NumberFieldOptional()
  price?: number;

  @EnumField(() => FuelTypeEnum)
  fuelType: FuelTypeEnum;

  @StringField()
  milage: string;

  @StringField()
  keyword: string;

  @StringField()
  engine: string;

  @StringFieldOptional()
  color?: string;

  @NumberField()
  yearFrom: number;

  @NumberField()
  yearTo: number;

  @NumberField()
  views: number;

  @EnumField(() => VerifiedEnum)
  isVerified: VerifiedEnum;

  @StringFieldOptional()
  description?: string;

  model: VehicleModelDto;

  user: UserDto;

  constructor(part: VehiclePartEntity) {
    super(part);
    this.name = part.name;
    this.category = part.category;
    this.customCleared = part.customCleared;
    this.bodyType = part.bodyType;
    this.priceType = part.priceType;
    this.price = part.price;
    this.paymentConditional = part.paymentConditional;
    this.fuelType = part.fuelType;
    this.milage = part.milage;
    this.engine = part.engine;
    this.color = part.color;
    this.yearFrom = part.yearFrom;
    this.yearTo = part.yearTo;
    this.keyword = part.keyword;
    this.views = part.views;
    this.isVerified = part.isVerified;
    this.description = part.description;
    this.user = part.user?.toDto();
    this.model = part.model?.toDto();
  }
}
