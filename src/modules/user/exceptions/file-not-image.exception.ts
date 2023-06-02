import { BadRequestException } from '@nestjs/common';

export class FileNotImageException extends BadRequestException {
  constructor() {
    super('error.fileNotImage');
  }
}
