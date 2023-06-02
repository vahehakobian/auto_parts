import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import { UserDto } from "../user/dto/user.dto";

import { Scope } from "../../common/scope.decorator";
import { RoleTypeEnum } from "../../constants";
import { Auth, AuthUser, UUIDParam } from "../../decorators";
import { UserEntity } from "../user/user.entity";
import { CreateVehiclePartDto } from "./dto/create-vehicle-part.dto";
import { UpdateVehiclePartDto } from "./dto/update-part.dto";
import { VehiclePartDto } from "./dto/vehicle-part.dto";
import { VehiclePartService } from "./vehicle-part.service";

@Controller("parts")
@ApiTags("parts")
export class VehiclePartsController {
  constructor(private vehiclePartService: VehiclePartService) {}

  @Auth([RoleTypeEnum.USER, RoleTypeEnum.ADMIN])
  @ApiCreatedResponse({
    type: VehiclePartDto,
    description: "Successfully created",
  })
  @ApiUnauthorizedResponse({ description: "User Unauthorized" })
  @ApiConflictResponse({ description: "Existing vin code" })
  @ApiUnprocessableEntityResponse({ description: "Unprocessable Entity" })
  //   @ApiFile([{ name: 'images', size: 10, isArray: true }], {
  //     isRequired: true,
  //   })
  @Post()
  async create(
    @AuthUser() user: UserEntity,
    @Body() createPartDto: CreateVehiclePartDto
  ): Promise<VehiclePartDto> {
    return this.vehiclePartService.create(user, createPartDto);
  }

  @Get()
  getAllParts(): Promise<VehiclePartDto[]> {
    return this.vehiclePartService.getAll();
  }

  @Get("part/:vinCode")
  @Scope("find parts by vin code")
  async findByVinCode(
    @Param("vinCode") vinCode: string
  ): Promise<VehiclePartDto[]> {
    return this.vehiclePartService.findByVinCode(vinCode);
  }

  @Get(":id")
  async getSingle(@UUIDParam("id") id: Uuid): Promise<VehiclePartDto> {
    return this.vehiclePartService.getSingle(id);
  }

  @Auth([RoleTypeEnum.USER, RoleTypeEnum.ADMIN])
  @Put(":id")
  async update(
    @UUIDParam("id") id: Uuid,
    @Body() updateVehiclePartDto: UpdateVehiclePartDto,
    @AuthUser() user: UserDto
  ): Promise<VehiclePartDto> {
    return this.vehiclePartService.update(id, updateVehiclePartDto, user);
  }

  @Auth([RoleTypeEnum.USER, RoleTypeEnum.ADMIN])
  @Delete(":id")
  async delete(
    @UUIDParam("id") id: Uuid,
    @AuthUser() user: UserDto
  ): Promise<void> {
    return this.vehiclePartService.delete(id, user);
  }
}
