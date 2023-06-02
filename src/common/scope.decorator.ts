/* eslint-disable @typescript-eslint/naming-convention */
import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

export const Scope = (scope: string): MethodDecorator =>
  applyDecorators(SetMetadata('', scope), ApiOperation({ summary: scope }));
