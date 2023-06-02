import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ApiConfigService } from './services/api-config.service';
// import { AwsS3Service } from './services/aws-s3.service';
import { GeneratorService } from './services/generator.service';
import { JwtService } from './services/jwt.service';
import { MailService } from './services/mail.service';
import { ValidatorService } from './services/validator.service';

const providers = [
  ApiConfigService,
  ValidatorService,
  GeneratorService,
  JwtService,
  MailService,
  // AwsS3Service,
];

@Global()
@Module({
  providers,
  imports: [HttpModule, CqrsModule],
  exports: [
    ApiConfigService,
    ValidatorService,
    GeneratorService,
    JwtService,
    MailService,
    HttpModule,
    CqrsModule,
  ],
})
export class SharedModule {}
