/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { ValidationOptions } from 'class-validator';
import {
  getMetadataStorage,
  IsPhoneNumber as isPhoneNumber,
  registerDecorator,
  ValidateIf,
  ValidationTypes,
} from 'class-validator';
import { ValidationMetadata } from 'class-validator/cjs/metadata/ValidationMetadata';
import type { ValidationMetadataArgs } from 'class-validator/cjs/metadata/ValidationMetadataArgs';
import _ from 'lodash';

export function IsPassword(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object, propertyName) => {
    registerDecorator({
      propertyName: propertyName as string,
      name: 'isPassword',
      target: object.constructor,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          return /^[\d!#$%&*@A-Z^a-z]*$/.test(value);
        },
      },
    });
  };
}

export function IsPhoneNumber(
  validationOptions?: ValidationOptions & {
    region?: Parameters<typeof isPhoneNumber>[0];
  },
): PropertyDecorator {
  return isPhoneNumber(validationOptions?.region, {
    message: 'error.phoneNumber',
    ...validationOptions,
  });
}

export function IsTime(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object, propertyName) => {
    registerDecorator({
      propertyName: propertyName as string,
      name: 'time',
      target: object.constructor,
      options: validationOptions,
      validator: {
        validate(value: string): boolean {
          return _.isString(value) && /^(0\d|1\d|2[0-3]):[0-5]\d$/.test(value);
        },
        defaultMessage(): string {
          return 'error.invalidTime';
        },
      },
    });
  };
}

export function IsCustomDate(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object, propertyName) => {
    registerDecorator({
      propertyName: propertyName as string,
      name: 'date',
      target: object.constructor,
      options: validationOptions,
      validator: {
        validate(value: string): boolean {
          return (
            _.isString(value) &&
            /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]) (0\d|1\d|2[0-3]):[0-5]\d$/.test(
              value,
            )
          );
        },
        defaultMessage(): string {
          return 'error.invalidDate';
        },
      },
    });
  };
}

export function NotContainsLetters(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object, propertyName) => {
    registerDecorator({
      propertyName: propertyName as string,
      name: 'notContainsLetter',
      target: object.constructor,
      options: validationOptions,
      validator: {
        validate(value: string): boolean {
          return _.isString(value) && /^\+\d+$/.test(value);
        },
        defaultMessage(): string {
          return 'error.notContainsLetter';
        },
      },
    });
  };
}

export function IsTmpKey(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object, propertyName) => {
    registerDecorator({
      propertyName: propertyName as string,
      name: 'tmpKey',
      target: object.constructor,
      options: validationOptions,
      validator: {
        validate(value: string): boolean {
          if (validationOptions?.each && Array.isArray(value)) {
            let isTmp = true;

            for (const image of value) {
              if (!isTmp) {
                return isTmp;
              }

              isTmp = _.isString(image) && /^tmp\//.test(value);
            }

            return isTmp;
          }

          return _.isString(value) && /^tmp\//.test(value);
        },
        defaultMessage(): string {
          return 'error.invalidTmpKey';
        },
      },
    });
  };
}

export function IsPrice(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object, propertyName) => {
    registerDecorator({
      propertyName: propertyName as string,
      name: 'Price',
      target: object.constructor,
      options: validationOptions,
      validator: {
        validate(value: number): boolean {
          return (
            _.isNumber(value) &&
            value >= 0 &&
            Math.floor(value) < 1000 &&
            value.toString().length < 7
          );
        },
        defaultMessage(): string {
          return 'error.invalidPrice';
        },
      },
    });
  };
}

export function TakeIf<T>(
  func: (data: T) => boolean,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object, propertyName) => {
    const args: ValidationMetadataArgs = {
      validationOptions,
      propertyName: propertyName as string,
      type: ValidationTypes.CONDITIONAL_VALIDATION,
      target: object.constructor,
      constraints: [
        // eslint-disable-next-line @typescript-eslint/naming-convention
        (obj) => {
          const isOptional = func(obj);

          if (!isOptional) {
            delete obj[propertyName];
          }

          return isOptional;
        },
      ],
    };
    getMetadataStorage().addValidationMetadata(new ValidationMetadata(args));
  };
}

export function IsUndefinable(options?: ValidationOptions): PropertyDecorator {
  return ValidateIf((_obj, value) => value !== undefined, options);
}

export function IsNullable(options?: ValidationOptions): PropertyDecorator {
  return ValidateIf((_obj, value) => value !== null, options);
}
