import { NumberField, NumberFieldOptional, StringField } from "../../../decorators";

export class CreateSubscribeDto {
  @StringField({ description: 'maximum 1 word' })
  subscribe: string;

  @StringField()
  modelId: Uuid;

  @NumberField()
  yearFrom: number;

  @NumberField()
  yearTo: number;

  @NumberFieldOptional()
  minPrice?: number;
}
