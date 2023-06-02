/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { HttpException } from '@nestjs/common';

export class AwsS3Exception extends HttpException {
  constructor(error) {
    super(error.message, error.statusCode);
  }
}
