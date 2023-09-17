import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiDefaultResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ApiCustomResponse, ReqUser } from '../common/decorators';
import { IErrorResponse } from '../common/filters/errorResponse.interface';
import { GenericResponse } from '../common/interfaces/response.interface';
import { MongoIdValidationPipe } from '../common/pipes/mongoIdValidation.pipe';
import { Repositories } from '../database/repositories';
import { User } from '../user/entities/user.entity';
import { ChannelService } from './channel.service';
import { AddMembersDto } from './dto/addMembers.dto';
import { CreateChannelDto } from './dto/create.dto';
import { Channel } from './entities/channel.entity';

@Controller()
@ApiTags('Channel')
@ApiDefaultResponse({ type: IErrorResponse, description: 'Default error response.' })
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
    private readonly repositories: Repositories
  ) {}

  @Post()
  @ApiOperation({
    description: `
		Create a new channel. Channels can be direct(private) or public. 
		Use "isPublic" property to create appropriate channel.
		Member Ids array must not contain current(channel owner) user id.
		While creating direct channel, member Ids array must contain exactly one user id.
		`,
    summary: 'Create a new channel',
  })
  @ApiCustomResponse({
    status: HttpStatus.CREATED,
    model: Channel,
  })
  @ApiConflictResponse({
    status: HttpStatus.CONFLICT,
    type: IErrorResponse,
  })
  @ApiBody({
    type: CreateChannelDto,
    required: true,
  })
  public async createChannel(
    @ReqUser() currentUser: User,
    @Body() channelData: CreateChannelDto
  ): Promise<GenericResponse<Channel>> {
    const { name, memberIds } = channelData;

    const existingChannelName = await this.channelService.isChannelNameAlreadyExist(
      currentUser.id,
      name
    );

    if (existingChannelName)
      throw new ConflictException(
        `Channel with "${name}" name already exists for current user.`
      );

    const isCurrentUserIdExistInMemberIds = memberIds.some((id) =>
      id.equals(currentUser.id)
    );

    if (isCurrentUserIdExistInMemberIds)
      throw new BadRequestException(
        `The current user Id must not be included in the member Ids array.`
      );

    const channel = await this.channelService.create(currentUser.id, channelData);

    return {
      success: true,
      payload: channel,
    };
  }

  @Patch(':channelId/members')
  @ApiOperation({
    description: 'Add members to the channel',
    summary: 'Add  members',
  })
  @ApiCustomResponse({
    status: HttpStatus.OK,
    model: Channel,
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    type: IErrorResponse,
  })
  @ApiForbiddenResponse({
    status: HttpStatus.FORBIDDEN,
    type: IErrorResponse,
  })
  @ApiParam({
    name: 'channelId',
    type: String,
    required: true,
  })
  @ApiBody({
    type: AddMembersDto,
    required: true,
  })
  public async addMembers(
    @Param('channelId', MongoIdValidationPipe) channelId: ObjectId,
    @Body() { memberIds }: AddMembersDto
  ): Promise<GenericResponse<Channel>> {
    const existingChannel = await this.channelService.findChannelById(channelId);

    if (!existingChannel)
      throw new NotFoundException(`Channel with id ${channelId} not found.`);

    if (existingChannel.isPrivate)
      throw new ForbiddenException(`Permission denied. Private channel.`);

    for (const userId of memberIds) {
      const existingUser = await this.repositories.USER.findById(userId);

      if (!existingUser)
        throw new BadRequestException(`User with id ${userId} does not exist.`);
    }

    const channel = await this.channelService.addMembers(channelId, memberIds);

    return {
      success: true,
      payload: channel!,
    };
  }

  @Get()
  @ApiOperation({
    description: 'Get current user channels',
    summary: 'Get user channels',
  })
  @ApiCustomResponse({
    status: HttpStatus.OK,
    model: Channel,
    isArray: true,
  })
  public async getUserChannels(
    @ReqUser() currentUser: User
  ): Promise<GenericResponse<Channel>> {
    const channels = await this.channelService.getChannelsByUserId(currentUser.id);

    return {
      success: true,
      payload: channels,
    };
  }
}
