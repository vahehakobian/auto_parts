import { Controller, Delete, Get, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { RoleTypeEnum } from '../../constants';
import { Auth, AuthUser, UUIDParam } from '../../decorators';
import { UserDto } from '../user/dto/user.dto';
import { WishListDto } from './dto/wish-list.dto';
import { WishListService } from './wish-list.service';

@Controller('wish-list')
@ApiTags('wish-list')
export class WishListController {
  constructor(private readonly wishListService: WishListService) {}

  @Auth([RoleTypeEnum.USER, RoleTypeEnum.ADMIN])
  @ApiCreatedResponse({
    type: WishListDto,
    description: 'Successfully created',
  })
  @ApiUnauthorizedResponse({ description: 'User Unauthorized' })
  @ApiConflictResponse({ description: 'Existing vin code' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  @Post(':vehicleId')
  create(@AuthUser() user: UserDto, @UUIDParam('vehicleId') vehicleId: Uuid) {
    return this.wishListService.create(user, vehicleId);
  }

  @Auth([RoleTypeEnum.USER, RoleTypeEnum.ADMIN])
  @ApiOkResponse({ type: [WishListDto] })
  @Get()
  getAll(@AuthUser() user: UserDto): Promise<WishListDto[]> {
    return this.wishListService.getAll(user);
  }

  @ApiOkResponse({ type: WishListDto })
  @ApiNotFoundResponse({ description: 'wish_list_item_not_found' })
  @Get(':id')
  getSingle(@UUIDParam('id') id: Uuid): Promise<WishListDto> {
    return this.wishListService.getSingle(id);
  }

  @Auth([RoleTypeEnum.ADMIN, RoleTypeEnum.USER])
  @ApiOkResponse({ description: 'Successfully deleted' })
  @ApiNotFoundResponse({ description: 'wish_list_item_not_found' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Delete(':id')
  remove(@AuthUser() user: UserDto, @UUIDParam('id') id: Uuid): Promise<void> {
    return this.wishListService.deleteItem(user.id, id);
  }
}
