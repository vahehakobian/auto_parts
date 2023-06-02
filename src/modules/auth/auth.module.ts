import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../../shared/shared.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PublicStrategy } from './public.strategy';
import { UserTokenEntity } from './users-token.entity';
import { UserTokenService } from './users-token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserTokenEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => SharedModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PublicStrategy, UserTokenService],
  exports: [AuthService, UserTokenService],
})
export class AuthModule {}
