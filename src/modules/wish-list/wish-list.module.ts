import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VehiclePartModule } from '../vehicle-part/vehicle-part.module';
import { WishListController } from './wish-list.controller';
import { WishListEntity } from './wish-list.entity';
import { WishListService } from './wish-list.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WishListEntity]),
    forwardRef(() => VehiclePartModule),
  ],
  controllers: [WishListController],
  exports: [WishListService],
  providers: [WishListService],
})
export class WishListModule {}
