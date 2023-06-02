import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { RoleTypeEnum } from '../../constants';
import { Auth, UUIDParam } from '../../decorators';
import { CreateVehicleModelDto } from './dto/create-vehicle-model.dto';
import { UpdateVehicleModelDto } from './dto/update-vehicle.dto';
import { VehicleModelDto } from './dto/vehicle-model.dto';
import { VehicleModelService } from './vehicle-model.service';

@Controller('vehicle-model')
@ApiTags('vehicle-model')
export class VehicleMoodelController {
  private syncModelInProgress = false;

  constructor(private readonly vehicleModelService: VehicleModelService) {}

  @Auth([RoleTypeEnum.ADMIN])
  @ApiCreatedResponse({
    type: VehicleModelDto,
    description: 'Successfully created',
  })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'brand_not_found' })
  @Post()
  create(@Body() createVehicleModelDto: CreateVehicleModelDto) {
    return this.vehicleModelService.create(createVehicleModelDto);
  }

  @Get()
  @ApiOkResponse({ type: [VehicleModelDto] })
  findAll() {
    return this.vehicleModelService.findAll();
  }

  @ApiOkResponse({ type: VehicleModelDto })
  @ApiNotFoundResponse({ description: 'model_not_found' })
  @Get(':id')
  findOne(@UUIDParam('id') id: Uuid) {
    return this.vehicleModelService.findOne(id);
  }

  @ApiOkResponse({ type: VehicleModelDto })
  @ApiNotFoundResponse({ description: 'model_not_found' })
  @Get('brand/:brandId')
  getByBrand(@UUIDParam('brandId') brandId: Uuid) {
    return this.vehicleModelService.getByBrand(brandId);
  }

  @Auth([RoleTypeEnum.ADMIN])
  @ApiCreatedResponse({
    type: VehicleModelDto,
    description: 'Successfully updated',
  })
  @ApiNotFoundResponse({ description: 'vehicle_not_found' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Put(':id')
  update(
    @UUIDParam('id') id: Uuid,
    @Body() updateVehicleModelDto: UpdateVehicleModelDto,
  ) {
    return this.vehicleModelService.update(id, updateVehicleModelDto);
  }

  @Auth([RoleTypeEnum.ADMIN])
  @ApiCreatedResponse({
    type: VehicleModelDto,
    description: 'Successfully updated',
  })
  @ApiNotFoundResponse({ description: 'vehicle_not_found' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Delete(':id')
  remove(@UUIDParam('id') id: Uuid) {
    return this.vehicleModelService.remove(id);
  }

  @Cron(CronExpression.EVERY_WEEK)
  @Get('sync/force')
  async createAllModels() {
    if (this.syncModelInProgress) {
      return;
    }

    return this.vehicleModelService.createAllModels();
  }
}
