import { Body, Controller, Delete, Get, Post, Put } from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import { RoleTypeEnum } from "../../constants";
import { Auth, AuthUser, UUIDParam } from "../../decorators";
import { CreateSubscribeDto } from "./dto/create-subscribe.dto";

import { SubscribeService } from "./subscribe.service";
import { UserDto } from "../user/dto/user.dto";
import { SubscribeDto } from "./dto/subscribe.dto";
import { UpdateSubscribeDto } from "./dto/update-subscribe.dto";

@Controller("subscribe")
@ApiTags("subscribe")
export class SubscribeController {
  constructor(private readonly subscribeService: SubscribeService) {}

  @Auth([RoleTypeEnum.USER, RoleTypeEnum.ADMIN])
  @Post()
  async create(
    @Body() createSubscribeDto: CreateSubscribeDto,
    @AuthUser() user: UserDto
  ): Promise<SubscribeDto> {
    return this.subscribeService.create(createSubscribeDto, user);
  }

  @Auth([RoleTypeEnum.USER, RoleTypeEnum.ADMIN])
  @Get()
  @ApiOkResponse({ type: [SubscribeDto] })
  findAll(@AuthUser() user: UserDto) {
    return this.subscribeService.findAll(user);
  }

  @Auth([RoleTypeEnum.USER, RoleTypeEnum.ADMIN])
  @ApiOkResponse({ type: SubscribeDto })
  @ApiNotFoundResponse({ description: "subscribe_not_found" })
  @Get(":id")
  findOne(@UUIDParam("id") id: Uuid, @AuthUser() user: UserDto) {
    return this.subscribeService.findOne(id, user);
  }

  @Auth([RoleTypeEnum.ADMIN, RoleTypeEnum.USER])
  @ApiCreatedResponse({
    type: SubscribeDto,
    description: "Successfully updated",
  })
  @ApiNotFoundResponse({ description: "subscribe_not_found" })
  @ApiForbiddenResponse({ description: "Forbidden resource" })
  @ApiUnprocessableEntityResponse({ description: "Unprocessable Entity" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Put(":id")
  update(
    @UUIDParam("id") id: Uuid,
    @Body() updateSubscribeDto: UpdateSubscribeDto,
    @AuthUser() user: UserDto
  ) {
    return this.subscribeService.update(id, updateSubscribeDto, user);
  }

  @Auth([RoleTypeEnum.ADMIN, RoleTypeEnum.USER])
  @ApiCreatedResponse({
    type: SubscribeDto,
    description: "Successfully updated",
  })
  @ApiNotFoundResponse({ description: "subscribe_not_found" })
  @ApiForbiddenResponse({ description: "Forbidden resource" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @Delete(":id")
  remove(@UUIDParam("id") id: Uuid, @AuthUser() user: UserDto) {
    return this.subscribeService.remove(user, id);
  }
}
