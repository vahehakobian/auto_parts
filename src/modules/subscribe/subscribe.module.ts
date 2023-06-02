import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SharedModule } from "../../shared/shared.module";
import { VehicleModelModule } from "../vehicle-models/vehicle-model.module";

import { SubscribeController } from "./subscribe.controller";
import { SubscribeEntity } from "./subscribe.entity";
import { SubscribeService } from "./subscribe.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscribeEntity]),
    forwardRef(() => VehicleModelModule),
    forwardRef(() => SharedModule)
  ],
  controllers: [SubscribeController],
  exports: [SubscribeService],
  providers: [SubscribeService],
})
export class SubscribeModule {}
