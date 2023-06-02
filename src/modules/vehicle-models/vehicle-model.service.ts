import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository } from 'typeorm';

import { VehicleBrandService } from '../vehicle-brand/vehicle-brand.service';
import type { CreateVehicleModelDto } from './dto/create-vehicle-model.dto';
import type { UpdateVehicleModelDto } from './dto/update-vehicle.dto';
import type { VehicleModelDto } from './dto/vehicle-model.dto';
import { VehicleModelNotFoundException } from './exceptions/vehicle-model-not-found.exception';
import { VehicleModelEntity } from './vehicle-model.entity';

@Injectable()
export class VehicleModelService {
  constructor(
    @InjectRepository(VehicleModelEntity)
    private readonly vehicleModelRepository: Repository<VehicleModelEntity>,
    private readonly vehicleBrandService: VehicleBrandService,
  ) {}

  async create(createVehicleModelDto: CreateVehicleModelDto) {
    const brand = await this.vehicleBrandService.findOneByName(
      createVehicleModelDto.brand,
    );
    const model = this.vehicleModelRepository.create({
      ...createVehicleModelDto,
      brand,
    });

    await this.vehicleModelRepository.save(model);

    return model;
  }

  async createAllModels(): Promise<void> {
    // await this.vehicleModelRepository.query('TRUNCATE vehicle_model CASCADE;');

    // await this.vehicleBrandService.cleareTable();

    const { data } = await axios.get(
      'https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json',
    );

    for await (const brand of data.Results) {
      try {
        const newBrand = await this.vehicleBrandService.create({
          name: brand.MakeName,
        });

        const modelData = await axios.get(
          `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${newBrand.name}?format=json`,
        );

        for await (const model of modelData.data.Results) {
          const newModel = this.vehicleModelRepository.create({
            name: model.Model_Name,
            brand: newBrand,
          });

          await this.vehicleModelRepository.save(newModel);
        }
      } catch {
        continue;
      }
    }
  }

  async findAll(): Promise<VehicleModelDto[]> {
    const models = await this.vehicleModelRepository
      .createQueryBuilder('vehicle_model')
      .leftJoinAndSelect('vehicle_model.brand', 'vehicle_brand')
      .getMany();

    return models.toDtos();
  }

  async findOne(id: Uuid): Promise<VehicleModelDto> {
    const model = await this.vehicleModelRepository
      .createQueryBuilder('vehicle_model')
      .leftJoinAndSelect('vehicle_model.brand', 'vehicle_brand')
      .where('vehicle_model.id = :id', { id })
      .getOne();

    if (!model) {
      throw new VehicleModelNotFoundException();
    }

    return model.toDto();
  }

  async getByBrand(brandId: Uuid): Promise<VehicleModelDto[]> {
    return this.vehicleModelRepository
      .createQueryBuilder('vehicle_model')
      .where('vehicle_model.brand_id = :brandId', { brandId })
      .getMany();
  }

  async findOneByName(name: string): Promise<VehicleModelDto | null> {
    const model = await this.vehicleModelRepository
      .createQueryBuilder('vehicle_model')
      .where('name = :name', { name })
      .getOne();

    return model;
  }

  async update(
    id: Uuid,
    updateVehicleModelDto: UpdateVehicleModelDto,
  ): Promise<VehicleModelDto> {
    let brand;

    if (updateVehicleModelDto.brand) {
      brand = await this.vehicleBrandService.findOneByName(
        updateVehicleModelDto.brand,
      );
    }

    const model = { ...updateVehicleModelDto, brand };
    await this.vehicleModelRepository
      .createQueryBuilder('vehicle_model')
      .update(VehicleModelEntity)
      .where('id = :id', { id })
      .set(model)
      .execute();

    return this.findOne(id);
  }

  async remove(id: Uuid): Promise<void> {
    await this.vehicleModelRepository
      .createQueryBuilder('vehicle_model')
      .delete()

      .where('id = :id', { id })
      .execute();
  }
}
