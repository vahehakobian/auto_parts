import { Injectable } from '@nestjs/common';
import type { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

import { TokenTypeEnum } from '../../constants';
import { InvalidTokenException } from '../../exceptions';
import type { IAccessTokenPayload } from '../../modules/auth/interfaces/IAccessTokenPayload';
import type { IAuthSessionTokenPayload } from '../../modules/auth/interfaces/IAuthSessionTokenPayload';
import type { IVerifyTokenPayload } from '../../modules/auth/interfaces/IVerifyTokenPayload';
import type { UserEntity } from '../../modules/user/user.entity';
import { ApiConfigService } from './api-config.service';

@Injectable()
export class JwtService {
  readonly jwtPrivateKey: string;

  readonly jwtPublicKey: string;

  constructor(public apiConfigService: ApiConfigService) {
    this.jwtPrivateKey = apiConfigService.authConfig.privateKey;
    this.jwtPublicKey = apiConfigService.authConfig.publicKey;
  }

  createAccessToken(userEntity: UserEntity): string {
    const payload: IAccessTokenPayload = {
      userId: userEntity.id,
      role: userEntity.role,
      type: TokenTypeEnum.ACCESS_TOKEN,
    };
    const options: jwt.SignOptions = {
      algorithm: 'RS256',
    };

    return jwt.sign(payload, this.jwtPrivateKey, options);
  }

  decodeToken<T>(token: string): T {
    try {
      return <T>jwt.decode(token);
    } catch {
      throw new InvalidTokenException();
    }
  }

  generateUserTemporaryToken(userId: Uuid) {
    const payload: IAuthSessionTokenPayload = {
      userId,
    };

    const options: jwt.SignOptions = {
      algorithm: 'RS256',
    };

    return jwt.sign(payload, this.jwtPrivateKey, options);
  }

  generateUserVerifyToken(userId: Uuid, type: TokenTypeEnum) {
    const payload: IVerifyTokenPayload = {
      userId,
      type,
    };

    return jwt.sign(payload, this.jwtPrivateKey);
  }

  isVerify(token: string) {
    return jwt.verify(token, this.jwtPrivateKey, {
      algorithms: ['RS384'],
    }) as JwtPayload;
  }
}
