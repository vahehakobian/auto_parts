import { omit } from 'lodash';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import type { LanguageCodeEnum } from '../constants/language-code.enum';
import type { Constructor } from '../types';
import type { AbstractDto, AbstractTranslationDto } from './dto/abstract.dto';

export interface IAbstractEntity<DTO extends AbstractDto, O = never> {
  id: Uuid;
  createdAt: Date;
  updatedAt: Date;

  toDto(options?: O): DTO;
}

export abstract class AbstractEntity<
  DTO extends AbstractDto = AbstractDto,
  O = never,
> implements IAbstractEntity<DTO, O>
{
  @PrimaryGeneratedColumn('uuid')
  id: Uuid;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;

  translations?: Array<AbstractEntity<AbstractTranslationDto>>;

  // Only For translations Entities
  languageCode?: LanguageCodeEnum;

  private dtoClass: Constructor<DTO, [AbstractEntity, O?]>;

  toDto(options?: O): DTO {
    const dtoClass = this.dtoClass;

    if (!dtoClass) {
      throw new Error(
        `You need to use @UseDto on class (${this.constructor.name}) be able to call toDto function`,
      );
    }

    return new this.dtoClass(this, options);
  }

  // FIXME: Create new Entity for translations. It's not good to use this method, e.g AbstractTranslationEntity
  public getTranslationFields() {
    return omit(this, [
      'id',
      'createdAt',
      'updatedAt',
      'languageCode',
      'dtoClass',
      'translations',
    ]);
  }
}
