import {
  Controller,
  Get,
  HttpStatus,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiDefaultResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import MongooseClassSerializer from '../common/Interceptors/mongooseClassSerializer.interceptor';
import { ApiCustomResponse, ReqUser } from '../common/decorators';
import { IErrorResponse } from '../common/filters/errorResponse.interface';
import { GenericResponse } from '../common/interfaces/response.interface';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
@ApiDefaultResponse({ type: IErrorResponse, description: 'Default error response.' })
@UseInterceptors(MongooseClassSerializer(User))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  @ApiOperation({
    description: 'Get current user data',
    summary: 'Get current user data',
  })
  @ApiCustomResponse({
    status: HttpStatus.OK,
    model: User,
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: IErrorResponse,
  })
  public async getCurrentUser(
    @ReqUser() currentUser: User
  ): Promise<GenericResponse<User>> {
    const existingUser = await this.userService.getUserById(currentUser.id);

    if (!existingUser) throw new UnauthorizedException();

    return {
      success: true,
      payload: existingUser,
    };
  }
}
