/* eslint-disable @typescript-eslint/naming-convention */
import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import _ from "lodash";
import { SubscribeService } from "../subscribe/subscribe.service";
import { Repository } from "typeorm";

import { RoleTypeEnum } from "../../constants";
import { VerifiedEnum } from "../../constants/verified-type.enum";
import type { UserEntity } from "../user/user.entity";
import { VehicleModelService } from "../vehicle-models/vehicle-model.service";
import type { CreateVehiclePartDto } from "./dto/create-vehicle-part.dto";
import type { VehiclePartDto } from "./dto/vehicle-part.dto";
import { VehiclePartNotFoundException } from "./exceptions/vehicle-part-not-found.exception";
import { VpicResponse } from "./interface/vpic-interface";
import { VehiclePartEntity } from "./vehicle-part.entity";
import { UpdateVehiclePartDto } from "./dto/update-part.dto";
import { VehicleModelDto } from "modules/vehicle-models/dto/vehicle-model.dto";
import { UserDto } from "modules/user/dto/user.dto";

@Injectable()
export class VehiclePartService {
  private readonly VinCheckerUrl =
    "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/";

  private readonly VinCheckUrlFormatQuery = "format=json";

  constructor(
    @InjectRepository(VehiclePartEntity)
    private partRepository: Repository<VehiclePartEntity>,
    private readonly vehicleModelService: VehicleModelService,
    private readonly subscribeService: SubscribeService
  ) {}

  async create(
    user: UserEntity,
    createPartDto: CreateVehiclePartDto
  ): Promise<VehiclePartDto> {
    if (createPartDto.keyword.split(" ").length > 1) {
      throw new UnprocessableEntityException();
    }

    const model = await this.vehicleModelService.findOne(createPartDto.modelId);

    const part = this.partRepository.create({
      ...createPartDto,
      user,
      isVerified:
        user.role === RoleTypeEnum.ADMIN
          ? VerifiedEnum.VERIFIED
          : VerifiedEnum.PENDING,
      model,
    });

    await this.partRepository.save(part);

    await this.subscribeService.sendMessage(part);

    return part.toDto();
  }

  async getAll(): Promise<VehiclePartDto[]> {
    const parts = await this.partRepository
      .createQueryBuilder("vehicle_parts")
      .orderBy("vehicle_parts.views", "DESC")
      .getMany();

    return parts.toDtos();
  }

  async getSingle(id: Uuid): Promise<VehiclePartDto> {
    const part = await this.partRepository
      .createQueryBuilder("vehicle_part")
      .where("vehicle_part.id = :id", { id })
      .getOne();

    if (!part) {
      throw new VehiclePartNotFoundException();
    }

    return part.toDto();
  }

  async findByVinCode(vin: string): Promise<VehiclePartDto[]> {
    const { data } = await axios.get<VpicResponse>(
      `${this.VinCheckerUrl}${vin}?${this.VinCheckUrlFormatQuery}`
    );

    const model = await this.vehicleModelService.findOneByName(
      data.Results[0].Model
    );

    const parts = this.partRepository.createQueryBuilder("vehicle_parts");

    if (data.Results[0].ModelYear) {
      parts
        .where("vehicle_parts.year_from >= :yearFrom", {
          yearFrom: data.Results[0].ModelYear,
        })
        .andWhere("vehicle_parts.year_to =< :yearTo", {
          yearTo: data.Results[0].ModelYear,
        });
    }

    if (model) {
      parts.andWhere("vehicle_parts.model_id = :modelId", {
        modelId: model?.id,
      });
    }

    if (data.Results[0].Model || data.Results[0].Make) {
      parts.orWhere("LOWER(vehicle_parts.name) LIKE :name", {
        name: `%${data.Results[0].Make.toLocaleLowerCase() || ""}${
          data.Results[0].Model || ""
        }%`,
      });
    }

    return parts.getMany();
  }

  async update(
    id: Uuid,
    updateVehiclePartDto: UpdateVehiclePartDto,
    user: UserDto
  ): Promise<VehiclePartDto> {
    const oldPart = await this.getSingle(id);

    if (oldPart.user.id !== user.id) {
      if (user.role !== RoleTypeEnum.ADMIN) {
        throw new ForbiddenException();
      }
    }

    let model: VehicleModelDto | undefined;
    if (updateVehiclePartDto.modelId) {
      model = await this.vehicleModelService.findOne(
        updateVehiclePartDto.modelId
      );
    }
    const part = this.partRepository.create({
      id,
      ...updateVehiclePartDto,
      model,
      isVerified:
        user.role === RoleTypeEnum.ADMIN
          ? VerifiedEnum.VERIFIED
          : VerifiedEnum.PENDING,
    });

    await this.partRepository.save(part);

    return part;
  }

  async delete(id: Uuid, user: UserDto): Promise<void> {
    const part = await this.getSingle(id);

    if (part.user.id !== user.id) {
      if (user.role !== RoleTypeEnum.ADMIN) {
        throw new ForbiddenException();
      }
    }

    await this.partRepository.delete(id);
  }
}
