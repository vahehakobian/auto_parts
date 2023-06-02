import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VehicleBrandModule } from '../vehicle-brand/vehicle-brand.module';
import { VehicleMoodelController } from './vehicle-model.controller';
import { VehicleModelEntity } from './vehicle-model.entity';
import { VehicleModelService } from './vehicle-model.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([VehicleModelEntity]),
    forwardRef(() => VehicleBrandModule),
  ],
  controllers: [VehicleMoodelController],
  exports: [VehicleModelService],
  providers: [VehicleModelService],
})
export class VehicleModelModule {}
