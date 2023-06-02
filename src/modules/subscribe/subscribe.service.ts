import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDto } from "../user/dto/user.dto";
import { Repository } from "typeorm";
import { CreateSubscribeDto } from "./dto/create-subscribe.dto";
import { SubscribeDto } from "./dto/subscribe.dto";

import { SubscribeEntity } from "./subscribe.entity";
import { VehicleModelService } from "../vehicle-models/vehicle-model.service";
import { MailService } from "../../shared/services/mail.service";
import { join } from "path";
import { ApiConfigService } from "../../shared/services/api-config.service";
import { SubscribeStateType } from "../../constants/subscribe-state-type.enum";
import { VehiclePartDto } from "modules/vehicle-part/dto/vehicle-part.dto";
import { SubscribeNotFoundException } from "./exceptions/subscribe-not-found.exception";
import { UpdateSubscribeDto } from "./dto/update-subscribe.dto";
import { RoleTypeEnum } from "../../constants";

@Injectable()
export class SubscribeService {
  constructor(
    @InjectRepository(SubscribeEntity)
    private readonly subscribeRepository: Repository<SubscribeEntity>,
    private readonly modelService: VehicleModelService,
    private readonly mailService: MailService,
    private readonly configService: ApiConfigService
  ) {}

  async create(
    createSubscribeDto: CreateSubscribeDto,
    user: UserDto
  ): Promise<SubscribeDto> {
    const model = await this.modelService.findOne(createSubscribeDto.modelId);

    const subscribe = this.subscribeRepository.create({
      ...createSubscribeDto,
      model,
      user,
    });

    await this.subscribeRepository.save(subscribe);

    return subscribe;    
  }

  async sendMessage(part: VehiclePartDto) {
    const query = this.subscribeRepository
      .createQueryBuilder("subscribe")
      .where("model_id = :modelId", { modelId: part.model.id })
      .orWhere("LOWER(subscribe.subscribe) LIKE :keyword", {
        keyword: `%${part.keyword.toLocaleLowerCase()}%`,
      })
      .andWhere("subscribe.subscribe_state = :type", {
        type: SubscribeStateType.ACTIVE,
      })
      .andWhere("subscribe.year_from >= :yearFrom", {
        yearFrom: part.yearFrom,
      })
      .andWhere("subscribe.year_to =< :yearTo", {
        yearTo: part.yearTo,
      })
      .leftJoinAndSelect("subscribe.user", "user");

    if (part.price) {
      query.andWhere("subscribe.minPrice =< :price", {
        price: part.price,
      });
    }

    const subscribes = await query.getMany();

    for await (const sunscribe of subscribes) {
      const url = join(this.configService.partUrl, part.id);
      const { email, fullName } = sunscribe.user;
      await this.mailService.send({
        to: email,
        from: process.env.MAIL_FROM,
        subject: "Subscribe Mail",
        html: this.mailService.subscribeMail(fullName, url),
      });
    }
  }

  async findAll(user: UserDto): Promise<SubscribeDto[]> {
    const subscribes = await this.subscribeRepository
      .createQueryBuilder("subscribe")
      .where("subscribe.user_id = :userId", { userId: user.id })
      .getMany();

    return subscribes.toDtos();
  }

  async findOne(id: Uuid, user: UserDto): Promise<SubscribeDto> {
    const subscribe = await this.subscribeRepository
      .createQueryBuilder("subscribe")
      .leftJoinAndSelect("subsribe.user", "user")
      .where("subscribe.id = :id", { id })
      .getOne();

    if (!subscribe) {
      throw new SubscribeNotFoundException();
    }

    if (subscribe.user.id !== user.id) {
      if (user.role !== RoleTypeEnum.ADMIN) {
        throw new ForbiddenException();
      }
    }

    return subscribe.toDto();
  }

  async update(
    id: Uuid,
    updateSubscribeDto: UpdateSubscribeDto,
    user: UserDto
  ): Promise<SubscribeDto> {
    const oldSubscribe = await this.findOne(id, user);

    const subscribe = this.subscribeRepository.create({
      ...oldSubscribe,
      ...updateSubscribeDto,
    });
    await this.subscribeRepository.save(subscribe);

    return subscribe;
  }

  async remove(user: UserDto, id: Uuid): Promise<void> {
    await this.findOne(id, user);
    await this.subscribeRepository
      .createQueryBuilder("subscribe")
      .delete()
      .where("id = :id", { id })
      .execute();
  }
}
