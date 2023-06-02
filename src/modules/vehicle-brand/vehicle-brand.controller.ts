import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { RoleTypeEnum } from '../../constants';
import { Auth, UUIDParam } from '../../decorators';
import { CreateVehicleBrandDto } from './dto/create-vehicle-brand.dto';
import { UpdateVehicleBrandDto } from './dto/update-vehicle.dto';
import { VehicleBrandDto } from './dto/vehicle-brand.dto';
import { VehicleBrandService } from './vehicle-brand.service';

@Controller('vehicle-brand')
@ApiTags('vehicle-brand')
export class VehicleBrandController {
  constructor(private readonly vehicleBrandService: VehicleBrandService) {}

  @Auth([RoleTypeEnum.ADMIN])
  @ApiCreatedResponse({
    type: VehicleBrandDto,
    description: 'Successfully created',
  })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  @Post()
  create(@Body() createVehicleBrandDto: CreateVehicleBrandDto) {
    return this.vehicleBrandService.create(createVehicleBrandDto);
  }

  @Get()
  @ApiOkResponse({ type: [VehicleBrandDto] })
  findAll(): Promise<VehicleBrandDto[]> {
    return this.vehicleBrandService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: VehicleBrandDto })
  @ApiNotFoundResponse({ description: 'vehicle_brand_not_found' })
  findOne(@UUIDParam('id') id: Uuid): Promise<VehicleBrandDto> {
    return this.vehicleBrandService.findOne(id);
  }

  @Auth([RoleTypeEnum.ADMIN])
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  @ApiNotFoundResponse({ description: 'vehicle_brand_not_found' })
  @ApiCreatedResponse({
    type: VehicleBrandDto,
    description: 'Successfully updated',
  })
  @Put(':id')
  update(
    @UUIDParam('id') id: Uuid,
    @Body() updateVehicleBrandDto: UpdateVehicleBrandDto,
  ) {
    return this.vehicleBrandService.update(id, updateVehicleBrandDto);
  }

  @Auth([RoleTypeEnum.ADMIN])
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiNotFoundResponse({ description: 'vehicle_brand_not_found' })
  @ApiCreatedResponse({ description: 'Successfully deleted' })
  @Delete(':id')
  remove(@UUIDParam('id') id: Uuid) {
    return this.vehicleBrandService.remove(id);
  }
}
