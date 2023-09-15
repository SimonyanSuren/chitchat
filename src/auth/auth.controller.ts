import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiDefaultResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import MongooseClassSerializer from '../common/Interceptors/mongooseClassSerializer.interceptor';
import { ApiCustomResponse, Public, ReqUser } from '../common/decorators';
import { IErrorResponse } from '../common/filters/errorResponse.interface';
import { JwtRefreshAuthGuard } from '../common/guards';
import { LocalAuthGuard } from '../common/guards/local.auth.guard';
import { GenericResponse } from '../common/interfaces/response.interface';
import { validatePassword } from '../common/utils/passwordValidator';
import { Repositories } from '../database/repositories';
import { User } from '../user/entities/user.entity';
import { SignInDto, SignUpDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
@ApiDefaultResponse({ type: IErrorResponse, description: 'Default error response.' })
@UseInterceptors(MongooseClassSerializer(User))
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly repositories: Repositories
  ) {}

  @Post('sign-up')
  @Public()
  @ApiOperation({
    description:
      'Sign up. After sign up, you will get confirmation email from Tangerbet. Please confirm email address.',
    summary: 'Sign Up',
  })
  @ApiCustomResponse({
    status: HttpStatus.CREATED,
    model: User,
  })
  @ApiBody({
    required: true,
    type: SignUpDto,
  })
  public async signup(@Body() signUpData: SignUpDto): Promise<GenericResponse<User>> {
    const { email, password, rePassword } = signUpData;

    const errorMessages = validatePassword(password, rePassword);

    if (errorMessages.length) {
      throw new BadRequestException(errorMessages);
    }

    const ifUserExists = await this.repositories.USER.findUserByEmail(email);

    if (ifUserExists) {
      throw new ConflictException('User already exists.');
    }

    const user = await this.authService.signUp(signUpData);

    if (!user) {
      throw new BadRequestException(
        'Error occurred while registering user, please sign up again.'
      );
    }

    return {
      success: true,
      payload: user,
    };
  }

  @Post('sign-in')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiOperation({
    description: 'Sign In',
    summary: 'Sign In',
  })
  @ApiCustomResponse({
    status: HttpStatus.OK,
    model: User,
  })
  @ApiBody({
    required: true,
    type: SignInDto,
  })
  public async signin(
    @ReqUser() user: User,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<GenericResponse<User>> {
    const userAgent = req.headers['user-agent'];
    const remoteAddress =
      req.get('x-real-ip') || req.get('x-forwarded-for') || req.socket.remoteAddress;

    const accessTokenCookie = await this.authService.getCookieWithAccessToken(
      user.id,
      remoteAddress,
      userAgent
    );

    const refreshTokenCookie = await this.authService.getCookieWithRefreshToken(
      user.id,
      remoteAddress,
      userAgent
    );

    await this.repositories.USER.findByIdAndUpdate(user.id, { lastLogin: new Date() });

    res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    return { success: true, payload: user };
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Sign Out',
    summary: 'Sign Out',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
  })
  public async logOut(
    @ReqUser() user: User,
    @Res({ passthrough: true }) res: Response
  ): Promise<GenericResponse<null>> {
    await this.authService.removeRefreshToken(user.id);

    res.setHeader('Set-Cookie', this.authService.getCookieForLogOut());

    return {
      success: true,
      payload: null,
    };
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Renew access token through refresh token',
    summary: 'Renew access token',
  })
  @ApiCustomResponse({
    status: HttpStatus.OK,
    model: User,
  })
  public async refresh(
    @ReqUser() user: User,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<GenericResponse<User>> {
    const userAgent = req.headers['user-agent'];
    const remoteAddress =
      req.get('x-real-ip') || req.get('x-forwarded-for') || req.socket.remoteAddress;

    const accessTokenCookie = await this.authService.getCookieWithAccessToken(
      user.id,
      remoteAddress,
      userAgent
    );

    res.setHeader('Set-Cookie', accessTokenCookie);

    return { success: true, payload: user };
  }
}
