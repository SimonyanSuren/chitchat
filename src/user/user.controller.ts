import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Patch,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiDefaultResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import MongooseClassSerializer from '../common/Interceptors/mongooseClassSerializer.interceptor';
import { ApiCustomResponse, Public, ReqUser } from '../common/decorators';
import { IErrorResponse } from '../common/filters/errorResponse.interface';
import { GenericResponse } from '../common/interfaces/response.interface';
import { UpdateUserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { Types } from 'mongoose';

@Controller('user')
@ApiTags('User')
@ApiDefaultResponse({ type: IErrorResponse, description: 'Default error response.' })
@UseInterceptors(MongooseClassSerializer(User))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    description: 'Get current user data',
    summary: 'Get current user data',
  })
  @ApiCustomResponse({
    status: HttpStatus.OK,
    model: User,
  })
	@Public()

  public async getCurrentUser(
    @ReqUser() currentUser: User
  ): Promise<GenericResponse<User>> {
    const existingUser = await this.userService.getUserById(
			new Types.ObjectId('64ff1f5b240d73b73583185e')
		);
    if (!existingUser) throw new UnauthorizedException();

    return {
      success: true,
      payload: existingUser,
    };
  }

  //@Patch()
  //@ApiOperation({
  //  description: 'Update current user data',
  //  summary: 'Update current user data',
  //})
  //@ApiCustomResponse({
  //  status: HttpStatus.OK,
  //  model: User,
  //})
  //@ApiBody({
  //  type: UpdateUserDto,
  //  required: true,
  //})
  //public async updateUser(
  //  @ReqUser() currentUser: User,
  //  @Body() updateData: UpdateUserDto
  //): Promise<GenericResponse<User>> {
  //  const updatedUser = await this.userService.updateUserData(currentUser.id, updateData);

  //  if (!updatedUser) throw new NotFoundException('User does not exist.');

  //  return {
  //    success: true,
  //    payload: updatedUser,
  //  };
  //}
}
