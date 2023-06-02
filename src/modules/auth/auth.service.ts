/* eslint-disable unicorn/import-style */
import { Injectable } from '@nestjs/common';
import { join } from 'path';

import { TokenTypeEnum } from '../../constants';
import { VerifiedEnum } from '../../constants/verified-type.enum';
import type { IPayload } from '../../interfaces/IPayload';
import { UtilsProvider } from '../../providers';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { JwtService } from '../../shared/services/jwt.service';
import { MailService } from '../../shared/services/mail.service';
import type { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { LoginPayloadDto } from './dto/login-payload.dto';
import type { UserLoginDto } from './dto/user-login.dto';
import type { UserRegisterDto } from './dto/user-register.dto';
import { InvalidPasswordException, UserNotFoundException } from './exceptions';
import { ForgotPasswordForbbidenException } from './exceptions/forgot-password.exception';
import { TokenNotFoundException } from './exceptions/verify-token-not-found-exception';
import { UserTokenService } from './users-token.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private readonly userTokenService: UserTokenService,
    private readonly configService: ApiConfigService,
    private readonly mailService: MailService,
  ) {}

  async sendVerify(user: UserEntity) {
    const tokenPayload: string = this.jwtService.generateUserVerifyToken(
      user.id,
      TokenTypeEnum.VERIFY_ACCOUNT,
    );

    await this.userTokenService.setToken({
      userId: user.id,
      token: tokenPayload,
      type: TokenTypeEnum.VERIFY_ACCOUNT,
    });

    const url = join(this.configService.verificationUrl, tokenPayload);

    await this.mailService.send({
      to: user.email,
      from: process.env.MAIL_FROM,
      subject: 'Verification Email',
      html: this.mailService.verificationMail(user.fullName, url),
    });
  }

  async register(userRegisterDto: UserRegisterDto): Promise<LoginPayloadDto> {
    const userEntity = await this.userService.createUser(userRegisterDto);

    const accessToken = this.jwtService.createAccessToken(userEntity);

    await this.sendVerify(userEntity);

    return new LoginPayloadDto({ accessToken, user: userEntity.toDto() });
  }

  async login(userLoginDto: UserLoginDto): Promise<LoginPayloadDto> {
    const userEntity = await this.userService.findByEmail(userLoginDto.email);

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    const isPasswordValid = await UtilsProvider.validateHash(
      userLoginDto.password,
      userEntity.password,
    );

    if (!isPasswordValid) {
      throw new InvalidPasswordException();
    }

    const accessToken = this.jwtService.createAccessToken(userEntity);

    return new LoginPayloadDto({ accessToken, user: userEntity.toDto() });
  }

  async verifyUser(token: string) {
    const payload: IPayload = this.jwtService.decodeToken(token);

    if (!payload) {
      throw new TokenNotFoundException();
    }

    const userToken = await this.userTokenService.getByUserId(payload.userId);

    if (
      payload.type !== userToken?.type ||
      payload.type !== TokenTypeEnum.VERIFY_ACCOUNT
    ) {
      throw new TokenNotFoundException();
    }

    if (userToken?.userId) {
      await this.userTokenService.delete(userToken.userId);

      await this.userService.updateVerified(
        userToken.userId,
        VerifiedEnum.VERIFIED,
      );
    }
  }

  async sendMessageForPassword(email: string) {
    const userEntity = await this.userService.findByEmail(email);

    if (!userEntity) {
      return;
    }

    if (userEntity.isVerified === VerifiedEnum.PENDING) {
      throw new ForgotPasswordForbbidenException();
    }

    const tokenPayload: string = this.jwtService.generateUserVerifyToken(
      userEntity.id,
      TokenTypeEnum.FORGOT_PASSWORD,
    );

    await this.userTokenService.setToken({
      userId: userEntity.id,
      token: tokenPayload,
      type: TokenTypeEnum.FORGOT_PASSWORD,
    });

    const url = join(this.configService.verificationUrl, tokenPayload);

    await this.mailService.send({
      to: userEntity.email,
      from: process.env.MAIL_FROM,
      subject: 'Forgot Password',
      html: this.mailService.verificationMail(userEntity.fullName, url),
    });
  }

  async changePassword(token: string, password: string) {
    const payload: IPayload = this.jwtService.decodeToken(token);

    const userToken = await this.userTokenService.getByUserId(payload.userId);

    if (
      payload.type !== userToken?.type ||
      payload.type !== TokenTypeEnum.FORGOT_PASSWORD
    ) {
      throw new TokenNotFoundException();
    }

    if (userToken) {
      await this.userService.updatePassword(userToken.userId, password);
    }
  }

  async sendToChangeEmail(email: string) {
    const userEntity = await this.userService.findByEmail(email);

    if (!userEntity) {
      return;
    }

    const tokenPayload: string = this.jwtService.generateUserVerifyToken(
      userEntity.id,
      TokenTypeEnum.EMAIL_CHANGE,
    );

    await this.userTokenService.setToken({
      userId: userEntity.id,
      token: tokenPayload,
      type: TokenTypeEnum.EMAIL_CHANGE,
    });

    const url = join(this.configService.changeEmailUrl, tokenPayload);

    await this.mailService.send({
      to: userEntity.email,
      from: process.env.MAIL_FROM,
      subject: 'Change Email',
      html: this.mailService.verificationMail(userEntity.fullName, url),
    });
  }

  async changeEmail(token: string, email: string) {
    const payload: IPayload = this.jwtService.decodeToken(token);

    const userToken = await this.userTokenService.getByUserId(payload.userId);

    if (
      payload.type !== userToken?.type ||
      payload.type !== TokenTypeEnum.EMAIL_CHANGE
    ) {
      throw new TokenNotFoundException();
    }

    if (userToken) {
      await this.userService.updateEmail(userToken.userId, email);
      const user = await this.userService.findById(userToken.userId);
      await this.sendVerify(user!);
    }
  }
}
