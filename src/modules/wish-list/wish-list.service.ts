import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { UserDto } from '../user/dto/user.dto';
import { VehiclePartService } from '../vehicle-part/vehicle-part.service';
import type { WishListDto } from './dto/wish-list.dto';
import { WishListItemNotFoundException } from './exceptions/wish-list-item-not-found.exception';
import { WishListEntity } from './wish-list.entity';

@Injectable()
export class WishListService {
  constructor(
    @InjectRepository(WishListEntity)
    private readonly wishListRepository: Repository<WishListEntity>,
    private readonly vehiclePartService: VehiclePartService,
  ) {}

  async create(user: UserDto, vehicleId: Uuid): Promise<WishListDto> {
    const vehiclepart = await this.vehiclePartService.getSingle(vehicleId);

    const wishList = this.wishListRepository.create({
      user,
      vehicleParts: vehiclepart,
    });

    await this.wishListRepository.save(wishList);

    return wishList;
  }

  async getAll(user: UserDto): Promise<WishListDto[]> {
    const wishLists = await this.wishListRepository
      .createQueryBuilder('wish_list')
      .where('wish_list.user_id = :userId', { userId: user.id })
      .leftJoinAndSelect('wish_list.user', 'user')
      .leftJoinAndSelect('wish_list.vehicle_part', 'vehicle_part')
      .getMany();

    return wishLists.toDtos();
  }

  async getSingle(id: Uuid): Promise<WishListDto> {
    const wishListItem = await this.wishListRepository
      .createQueryBuilder('wish_list')
      .where('wish_list.id = :id', { id })
      .leftJoinAndSelect('wish_list.user', 'user')
      .leftJoinAndSelect('wish_list.vehicle', 'vehicle')
      .getOne();

    if (!wishListItem) {
      throw new WishListItemNotFoundException();
    }

    return wishListItem.toDto();
  }

  async deleteItem(userId: Uuid, id: Uuid) {
    const wishListItem = await this.getSingle(id);

    if (wishListItem.user.id !== userId) {
      throw new ForbiddenException();
    }

    await this.wishListRepository
      .createQueryBuilder('wish_list')
      .where('id = :id', { id })
      .delete()
      .execute();
  }
}
