import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { Scope } from '../../common/scope.decorator';
import { RoleTypeEnum } from '../../constants';
import { Auth, AuthUser } from '../../decorators';
import { UserDto } from '../user/dto/user.dto';
import { AuthService } from './auth.service';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { SendUpdatePasswordEmailDto } from './dto/send-update-password-email.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserNotFoundException } from './exceptions';

@ApiException(() => [UserNotFoundException])
@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @Scope('JWT Token and User')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
  })
  socialLogin(
    @Body() userRegisterDto: UserRegisterDto,
  ): Promise<LoginPayloadDto> {
    return this.authService.register(userRegisterDto);
  }

  @Post('login')
  @Scope('JWT Token and User')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
  })
  login(@Body() loginDto: UserLoginDto): Promise<LoginPayloadDto> {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @Scope('Current user info')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleTypeEnum.USER])
  @ApiOkResponse({ type: UserDto, description: 'current user info' })
  getCurrentUser(@AuthUser() user?: UserDto) {
    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  @Get(':token')
  // @Scope('Email Verification')
  @ApiOkResponse({ description: 'Succesfuly Verified' })
  @ApiNotFoundResponse({ description: 'tokenNotFound' })
  verifyUser(@Param('token') token: string) {
    return this.authService.verifyUser(token);
  }

  @Post('forgot/password')
  // @Scope('Send Email forgot password verification')
  @ApiCreatedResponse({ description: 'Succesfuly sended message' })
  @ApiForbiddenResponse({ description: 'verifyYourAccount' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  forgotPassword(
    @Body() sendUpdatePasswordEmailDto: SendUpdatePasswordEmailDto,
  ) {
    return this.authService.sendMessageForPassword(
      sendUpdatePasswordEmailDto.email,
    );
  }

  @Post('change/email')
  // @Scope('Send Email change email verification')
  @Auth([RoleTypeEnum.ADMIN, RoleTypeEnum.USER])
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'tokenNotFound' })
  @ApiCreatedResponse({ description: 'Succesfuly sended message' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  sendToChangeEmail(
    @Body() sendUpdatePasswordEmailDto: SendUpdatePasswordEmailDto,
  ) {
    return this.authService.sendToChangeEmail(sendUpdatePasswordEmailDto.email);
  }

  @Post('change/email/:token')
  // @Scope('Change email by verificatin token')
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  @ApiNotFoundResponse({ description: 'tokenNotFound' })
  @ApiCreatedResponse({ description: 'Succesfuly sended message' })
  changeEmail(
    @Param('token') token: string,
    @Body() sendUpdatePasswordEmailDto: SendUpdatePasswordEmailDto,
  ) {
    return this.authService.changeEmail(
      token,
      sendUpdatePasswordEmailDto.email,
    );
  }

  @Post('forgot/password:token')
  // @Scope('Change password by verificatin token')
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  @ApiNotFoundResponse({ description: 'tokenNotFound' })
  @ApiCreatedResponse({ description: 'Succesfuly changed' })
  changePassword(
    @Param('token') token: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.authService.changePassword(token, updatePasswordDto.password);
  }
}
