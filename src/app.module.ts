import './boilerplate.polyfill';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';

import { AuthModule } from './modules/auth/auth.module';
import { HealthCheckerModule } from './modules/health-checker/health-checker.module';
import { UserModule } from './modules/user/user.module';
import { VehicleBrandModule } from './modules/vehicle-brand/vehicle-brand.module';
import { VehicleModelModule } from './modules/vehicle-models/vehicle-model.module';
import { VehiclePartModule } from './modules/vehicle-part/vehicle-part.module';
import { WishListModule } from './modules/wish-list/wish-list.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';
import { SubscribeModule } from './modules/subscribe/subscribe.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    VehiclePartModule,
    VehicleBrandModule,
    VehicleModelModule,
    WishListModule,
    SubscribeModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.test.env' : '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) =>
        configService.postgresConfig,
      inject: [ApiConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) => configService.mailConfig,
      inject: [ApiConfigService],
    }),
    HealthCheckerModule,
  ],
})
export class AppModule {}
