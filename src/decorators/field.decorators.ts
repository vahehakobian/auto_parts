/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable unicorn/no-null */
import { applyDecorators } from '@nestjs/common';
import type { ApiPropertyOptions } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  NotEquals,
} from 'class-validator';
import _ from 'lodash';

import { ApiEnumProperty, UUIDProperty } from './property.decorators';
import {
  PhoneNumberSerializer,
  ToArray,
  ToBoolean,
  ToLowerCase,
  ToUpperCase,
  Trim,
} from './transform.decorators';
import {
  IsCustomDate,
  IsNullable,
  IsPassword,
  IsPhoneNumber,
  IsPrice,
  IsTime,
  IsTmpKey as IsTemporaryKey,
  IsUndefinable,
} from './validators.decorators';

interface INumberFieldDecorator {
  each?: boolean;
  min?: number;
  max?: number;
  int?: boolean;
  isPositive?: boolean;
  swagger?: boolean;
  maxSize?: number;
  minSize?: number;
}

interface IStringFieldDecorator {
  minLength?: number;
  maxLength?: number;
  toLowerCase?: boolean;
  toUpperCase?: boolean;
  swagger?: boolean;
  maxSize?: number;
  minSize?: number;
  each?: boolean;
  skipTrim?: boolean;
}

export function NumberField(
  options: Omit<ApiPropertyOptions, 'type'> & INumberFieldDecorator = {},
): PropertyDecorator {
  const decorators = [Type(() => Number)];

  if (options.nullable) {
    decorators.push(IsNullable({ each: options.each }));
  } else {
    decorators.push(NotEquals(null, { each: options.each }));
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: Number, ...options }));
  }

  if (options.each) {
    decorators.push(ToArray());
  }

  if (options.int) {
    decorators.push(IsInt({ each: options.each }));
  } else {
    decorators.push(IsNumber({}, { each: options.each }));
  }

  //TODO fix ts version conflicts
  if (options.min && _.isNumber(options.min)) {
    decorators.push(Min(options.min, { each: options.each }));
  }

  //TODO fix ts version conflicts
  if (options.max && _.isNumber(options.max)) {
    decorators.push(Max(options.max, { each: options.each }));
  }

  if (options.isPositive) {
    decorators.push(IsPositive({ each: options.each }));
  }

  if (options.maxSize && options.each) {
    decorators.push(ArrayMaxSize(options.maxSize));
  }

  if (options.minSize && options.each) {
    decorators.push(ArrayMinSize(options.minSize));
  }

  return applyDecorators(...decorators);
}

export function NumberFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    INumberFieldDecorator = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    NumberField({ required: false, ...options }),
  );
}

export function StringField(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldDecorator = {},
): PropertyDecorator {
  const decorators = [IsString({ each: options.each })];

  if (!options.skipTrim) {
    decorators.push(Trim());
  }

  if (options.nullable) {
    decorators.push(IsNullable({ each: options.each }));
  } else {
    decorators.push(NotEquals(null, { each: options.each }));
  }

  if (options.swagger !== false) {
    decorators.push(
      ApiProperty({ type: String, ...options, isArray: options.each }),
    );
  }

  if (options.minLength) {
    decorators.push(MinLength(options.minLength, { each: options.each }));
  }

  if (options.maxLength) {
    decorators.push(MaxLength(options.maxLength, { each: options.each }));
  }

  if (options.toLowerCase) {
    decorators.push(ToLowerCase());
  }

  if (options.toUpperCase) {
    decorators.push(ToUpperCase());
  }

  if (options.maxSize && options.each) {
    decorators.push(ArrayMaxSize(options.maxSize));
  }

  if (options.minSize && options.each) {
    decorators.push(ArrayMinSize(options.minSize));
  }

  return applyDecorators(...decorators);
}

export function StringFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    IStringFieldDecorator & { nullable?: boolean } = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    StringField({ required: false, ...options }),
  );
}

export function UsernameField(
  options: Omit<ApiPropertyOptions, 'type' | 'minLength'> &
    IStringFieldDecorator = {},
): PropertyDecorator {
  const decorators = [StringField({ minLength: 6, ...options })];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  return applyDecorators(...decorators);
}

export function UsernameFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required' | 'minLength'> &
    IStringFieldDecorator & { nullable?: boolean } = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    UsernameField({ required: false, ...options }),
  );
}

export function PasswordField(
  options: Omit<ApiPropertyOptions, 'type' | 'minLength'> &
    IStringFieldDecorator = {},
): PropertyDecorator {
  const decorators = [
    StringField({ format: '^[\\d!#$%&*@A-Z^a-z]*$', ...options }),
    IsPassword(),
  ];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  return applyDecorators(...decorators);
}

export function PasswordFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required' | 'minLength'> &
    IStringFieldDecorator & { nullable?: boolean } = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    PasswordField({ required: false, ...options }),
  );
}

export function BooleanField(
  options: Omit<ApiPropertyOptions, 'type'> &
    Partial<{ swagger: boolean }> = {},
): PropertyDecorator {
  const decorators = [IsBoolean(), ToBoolean()];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: Boolean, ...options }));
  }

  return applyDecorators(...decorators);
}

export function BooleanFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    Partial<{ swagger: boolean; nullable: boolean }> = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    BooleanField({ required: false, ...options }),
  );
}

export function TimeField(
  options: Omit<ApiPropertyOptions, 'type'> &
    Partial<{ swagger: boolean }> = {},
): PropertyDecorator {
  const decorators = [IsTime()];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  if (options.swagger !== false) {
    decorators.push(
      ApiProperty({
        type: String,
        ...options,
        format: '(1[012]|[1-9]):[0-5][0-9](\\s)?(?i)(am|pm)"',
      }),
    );
  }

  return applyDecorators(...decorators);
}

export function TimeFieldOptional(
  options: Omit<ApiPropertyOptions, 'type'> &
    Partial<{ swagger: boolean }> = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    TimeField({ required: false, ...options }),
  );
}

export function PriceField(
  options: Omit<ApiPropertyOptions, 'type'> &
    Partial<{ isPositive: boolean; swagger: boolean }> = {},
): PropertyDecorator {
  const decorators = [IsPrice()];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: Number, ...options }));
  }

  if (options.isPositive) {
    decorators.push(IsPositive());
  }

  return applyDecorators(...decorators);
}

export function PriceFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    Partial<{ isPositive: boolean; swagger: boolean; nullable: boolean }> = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    PriceField({ required: false, ...options }),
  );
}

export function TmpKeyField(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldDecorator = {},
): PropertyDecorator {
  const decorators = [
    StringField(options),
    IsTemporaryKey({ each: options.each }),
  ];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  if (options.swagger !== false) {
    decorators.push(
      ApiProperty({ type: String, ...options, isArray: options.each }),
    );
  }

  return applyDecorators(...decorators);
}

export function TmpKeyFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    IStringFieldDecorator = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    TmpKeyField({ required: false, ...options }),
  );
}

export function EnumField<TEnum>(
  getEnum: () => TEnum,
  options: Omit<ApiPropertyOptions, 'type' | 'enum' | 'enumName'> &
    Partial<{
      each: boolean;
      swagger: boolean;
    }> = {},
): PropertyDecorator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enumValue = getEnum() as any;
  const decorators = [IsEnum(enumValue, { each: options.each })];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  if (options.swagger !== false) {
    decorators.push(ApiEnumProperty(getEnum, options));
  }

  if (options.each) {
    options.isArray = true;
    decorators.push(ToArray());
  }

  return applyDecorators(...decorators);
}

export function EnumFieldOptional<TEnum>(
  getEnum: () => TEnum,
  options: Omit<ApiPropertyOptions, 'type' | 'required' | 'enum' | 'enumName'> &
    Partial<{ each: boolean; swagger: boolean; nullable: boolean }> = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    EnumField(getEnum, { required: false, ...options }),
  );
}

export function EmailField(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldDecorator = {},
): PropertyDecorator {
  const decorators = [
    IsEmail(),
    StringField({ toLowerCase: true, ...options }),
  ];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: String, ...options }));
  }

  return applyDecorators(...decorators);
}

export function EmailFieldOptional(
  options: Omit<ApiPropertyOptions, 'type'> &
    IStringFieldDecorator & { nullable?: boolean } = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    EmailField({ required: false, ...options }),
  );
}

export function PhoneField(
  options: Omit<ApiPropertyOptions, 'type'> &
    Partial<{ swagger: boolean }> = {},
): PropertyDecorator {
  const decorators = [IsPhoneNumber(), PhoneNumberSerializer()];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: String, ...options }));
  }

  return applyDecorators(...decorators);
}

export function PhoneFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    Partial<{ swagger: boolean; nullable: boolean }> = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    PhoneField({ required: false, ...options }),
  );
}

export function UUIDField(
  options: Omit<ApiPropertyOptions, 'type' | 'format'> &
    Partial<{ each: boolean; swagger: boolean }> = {},
): PropertyDecorator {
  const decorators = [IsUUID('4', { each: options.each })];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  if (options.swagger !== false) {
    decorators.push(UUIDProperty(options));
  }

  if (options.each) {
    decorators.push(ToArray());
  }

  return applyDecorators(...decorators);
}

export function UUIDFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    Partial<{ each: boolean; swagger: boolean; nullable: boolean }> = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    UUIDField({ required: false, ...options }),
  );
}

export function URLField(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldDecorator = {},
): PropertyDecorator {
  const decorators = [StringField(options), IsUrl({}, { each: true })];

  if (options.nullable) {
    decorators.push(IsNullable({ each: options.each }));
  } else {
    decorators.push(NotEquals(null, { each: options.each }));
  }

  return applyDecorators(...decorators);
}

export function URLFieldOptional(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldDecorator = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    URLField({ required: false, ...options }),
  );
}

export function DateField(
  options: Omit<ApiPropertyOptions, 'type'> &
    Partial<{ swagger: false; each?: boolean; nullable?: boolean }> = {},
): PropertyDecorator {
  const decorators = [Type(() => Date), IsDate({ each: options.each })];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  if (options.each) {
    options.isArray = true;
    decorators.push(ToArray());
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: Date, ...options }));
  }

  return applyDecorators(...decorators);
}

export function DateFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    Partial<{ swagger: false; nullable: boolean; each?: boolean }> = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    DateField({ ...options, required: false }),
  );
}

export function LinkedinField(
  options: Omit<ApiPropertyOptions, 'type'> & { nullable?: boolean } = {},
) {
  const decorators = [
    ApiProperty({ type: String }),
    Matches(/^(https:\/\/)?(www\.)?linkedin\.com([\w!#%&()+./:=?@~-]*)$/),
  ];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  return applyDecorators(...decorators);
}

export function FacebookField(
  options: Omit<ApiPropertyOptions, 'type'> & { nullable?: boolean } = {},
) {
  const decorators = [
    ApiProperty({ type: String }),
    Matches(/^(https:\/\/)?(www\.)?facebook\.com([\w!#%&()+./:=?@~-]*)$/),
  ];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  return applyDecorators(...decorators);
}

export function InstagramField(
  options: Omit<ApiPropertyOptions, 'type'> & { nullable?: boolean } = {},
) {
  const decorators = [
    ApiProperty({ type: String }),
    Matches(/^(https:\/\/)?(www\.)?instagram\.com([\w!#%&()+./:=?@~-]*)$/),
  ];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  return applyDecorators(...decorators);
}

export function TwitterField(
  options: Omit<ApiPropertyOptions, 'type'> & { nullable?: boolean } = {},
) {
  const decorators = [
    ApiProperty({ type: String }),
    Matches(/^(https:\/\/)?(www\.)?twitter\.com([\w!#%&()+./:=?@~-]*)$/),
  ];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  return applyDecorators(...decorators);
}

export function WebsiteField(
  options: Omit<ApiPropertyOptions, 'type'> & { nullable?: boolean } = {},
) {
  const decorators = [
    ApiProperty({ type: String }),
    Matches(
      /^(https:\/\/)?(www\.)?[\w#%+.:=@~-]{1,256}\.[\d()A-Za-z]{1,6}([\w!#%&()+./:=?@~-]*)$/,
    ),
  ];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  return applyDecorators(...decorators);
}

export function LinkedinFieldOptional(
  options: Omit<ApiPropertyOptions, 'type'> & { nullable?: boolean } = {},
) {
  return applyDecorators(LinkedinField(options), IsUndefinable());
}

export function FacebookFieldOptional(
  options: Omit<ApiPropertyOptions, 'type'> & { nullable?: boolean } = {},
) {
  return applyDecorators(FacebookField(options), IsUndefinable());
}

export function InstagramFieldOptional(
  options: Omit<ApiPropertyOptions, 'type'> & { nullable?: boolean } = {},
) {
  return applyDecorators(InstagramField(options), IsUndefinable());
}

export function TwitterFieldOptional(
  options: Omit<ApiPropertyOptions, 'type'> & { nullable?: boolean } = {},
) {
  return applyDecorators(TwitterField(options), IsUndefinable());
}

export function WebsiteFieldOptional(
  options: Omit<ApiPropertyOptions, 'type'> & { nullable?: boolean } = {},
) {
  return applyDecorators(WebsiteField(options), IsUndefinable());
}

export function CustomDateField(
  options: Omit<ApiPropertyOptions, 'type'> &
    Partial<{ swagger: false; each?: boolean; nullable?: boolean }> = {},
): PropertyDecorator {
  const decorators = [IsCustomDate({ each: options.each })];

  if (options.nullable) {
    decorators.push(IsNullable({ each: options.each }));
  } else {
    decorators.push(NotEquals(null, { each: options.each }));
  }

  if (options.each) {
    options.isArray = true;
    decorators.push(ToArray());
  }

  if (options.swagger !== false) {
    decorators.push(
      ApiProperty({
        type: String,
        ...options,
        format: '(0[1-9]|1d|2d|3[01])-(0[1-9]|1[0-2])-(20)d{2}',
      }),
    );
  }

  return applyDecorators(...decorators);
}

export function CustomDateFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    Partial<{ swagger: false; nullable: boolean; each?: boolean }> = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    CustomDateField({ ...options, required: false }),
  );
}
