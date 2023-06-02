import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VehicleBrandController } from './vehicle-brand.controller';
import { VehicleBrandEntity } from './vehicle-brand.entity';
import { VehicleBrandService } from './vehicle-brand.service';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleBrandEntity])],
  controllers: [VehicleBrandController],
  exports: [VehicleBrandService],
  providers: [VehicleBrandService],
})
export class VehicleBrandModule {}
