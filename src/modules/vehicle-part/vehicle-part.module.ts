import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubscribeModule } from "../subscribe/subscribe.module";

import { VehicleModelModule } from "../vehicle-models/vehicle-model.module";
import { VehiclePartsController } from "./vehicle-part.controller";
import { VehiclePartEntity } from "./vehicle-part.entity";
import { VehiclePartService } from "./vehicle-part.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([VehiclePartEntity]),
    forwardRef(() => VehicleModelModule),
    forwardRef(() => SubscribeModule),
  ],
  controllers: [VehiclePartsController],
  exports: [VehiclePartService],
  providers: [VehiclePartService],
})
export class VehiclePartModule {}
