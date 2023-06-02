import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { Nullable } from '../../types';
import { UserSettingsDto } from './dto/user-settings.dto';

@Entity({ name: 'user_settings' })
@UseDto(UserSettingsDto)
export class UserSettingsEntity extends AbstractEntity<UserSettingsDto> {
  @Column({ type: 'uuid' })
  userId: Uuid;

  @Column({ nullable: true, type: 'varchar', array: true })
  problemsList: Nullable<string[]>;

  // @OneToOne(() => UserEntity, (userEntity) => userEntity.settings, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // @JoinColumn({ name: 'user_id' })
  // user: UserEntity;
}
