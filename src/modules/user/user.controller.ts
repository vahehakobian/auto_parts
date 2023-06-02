import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { PageDto } from '../../common/dto/page.dto';
import { RoleTypeEnum } from '../../constants';
import { ApiPageOkResponse, Auth, AuthUser, UUIDParam } from '../../decorators';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersPageOptionsDto } from './dto/users-page-options.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Auth([RoleTypeEnum.USER])
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get users list',
    type: PageDto,
  })
  getUsers(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    return this.userService.getUsers(pageOptionsDto);
  }

  @Get(':id')
  @Auth([RoleTypeEnum.USER])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get users list',
    type: UserDto,
  })
  async getUser(@UUIDParam('id') userId: Uuid): Promise<UserDto> {
    return this.userService.getUser(userId);
  }

  @Get('username/:username')
  @Auth([RoleTypeEnum.USER])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get username check',
  })
  async usernameCheck(@Query('username') username: string): Promise<boolean> {
    return this.userService.usernameCheck(username);
  }

  @Put(':id')
  @Auth([RoleTypeEnum.USER])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update user',
    type: UserDto,
  })
  async updateUser(
    @UUIDParam('id') userId: Uuid,
    @AuthUser() user: UserEntity,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    if (user.id !== userId) {
      throw new ForbiddenException();
    }
    return await this.userService.updateUser(userId, updateUserDto);
  }

  @Delete(':id')
  @Auth([RoleTypeEnum.USER])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete user',
    type: UserDto,
  })
  delete(
    @UUIDParam('id') userId: Uuid,
    @AuthUser() user: UserEntity,
  ): Promise<void> {
    if (user.id !== userId) {
      throw new ForbiddenException();
    }

    return this.userService.delete(userId);
  }
}
