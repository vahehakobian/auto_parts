import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { CreateVehicleBrandDto } from './dto/create-vehicle-brand.dto';
import type { UpdateVehicleBrandDto } from './dto/update-vehicle.dto';
import type { VehicleBrandDto } from './dto/vehicle-brand.dto';
import { VehicleBrandNotFoundException } from './exceptions/vehicle-brand-not-found.exception';
import { VehicleBrandEntity } from './vehicle-brand.entity';

@Injectable()
export class VehicleBrandService {
  constructor(
    @InjectRepository(VehicleBrandEntity)
    private readonly vehicleBrandrepository: Repository<VehicleBrandEntity>,
  ) {}

  async create(createVehicleBrandDto: CreateVehicleBrandDto) {
    const brand = this.vehicleBrandrepository.create({
      name: createVehicleBrandDto.name,
    });
    await this.vehicleBrandrepository.save(brand);

    return brand;
  }

  async findAll(): Promise<VehicleBrandDto[]> {
    const vehicleBrands = await this.vehicleBrandrepository
      .createQueryBuilder('vehicle_brand')
      .leftJoinAndSelect('vehicle_brand.models', 'vehicle_model')
      .getMany();

    return vehicleBrands.toDtos();
  }

  async cleareTable(): Promise<void> {
    await this.vehicleBrandrepository.query('TRUNCATE vehicle_brand CASCADE;');
  }

  async findOne(id: Uuid): Promise<VehicleBrandDto> {
    const vehicleBrand = await this.vehicleBrandrepository
      .createQueryBuilder('vehicle_brand')
      .leftJoinAndSelect('vehicle_brand.models', 'vehicle_model')
      .where('vehicle_brand.id = :id', { id })
      .getOne();

    if (!vehicleBrand) {
      throw new VehicleBrandNotFoundException();
    }

    return vehicleBrand.toDto();
  }

  async findOneByName(name: string): Promise<VehicleBrandDto> {
    const vehicleBrand = await this.vehicleBrandrepository
      .createQueryBuilder('vehicle_brand')
      .where('name = :name', { name })
      .getOne();

    if (!vehicleBrand) {
      throw new VehicleBrandNotFoundException();
    }

    return vehicleBrand.toDto();
  }

  async update(id: Uuid, updateVehicleBrandDto: UpdateVehicleBrandDto) {
    const oldBrand = await this.findOne(id);
    const updatedBrand = this.vehicleBrandrepository.create({
      ...oldBrand,
      ...updateVehicleBrandDto,
    });
    await this.vehicleBrandrepository.save(updatedBrand);

    return updatedBrand;
  }

  async remove(id: Uuid) {
    await this.findOne(id);
    await this.vehicleBrandrepository
      .createQueryBuilder('vehicle_brand')
      .delete()
      .where('id = :id', { id })
      .execute();
  }
}
