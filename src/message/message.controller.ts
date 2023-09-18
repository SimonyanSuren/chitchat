import {
  Body,
  Controller,
  Delete,
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
import { ChannelService } from '../channel/channel.service';
import { ApiCustomResponse, ReqUser } from '../common/decorators';
import { IErrorResponse } from '../common/filters/errorResponse.interface';
import { GenericResponse } from '../common/interfaces/response.interface';
import { MongoIdValidationPipe } from '../common/pipes/mongoIdValidation.pipe';
import { User } from '../user/entities/user.entity';
import { SendMessageDto } from './dto/send.dto';
import { UpdateMessageDto } from './dto/update.dto';
import { Message } from './entities/message.entity';
import { MessageService } from './message.service';

@Controller('message')
@ApiTags('Message')
@ApiDefaultResponse({ type: IErrorResponse, description: 'Default error response.' })
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly channelService: ChannelService
  ) {}

  // @TODO: Implement WebSockets for messaging
  @Post()
  @ApiOperation({
    description: 'Send a message to a channel.',
    summary: 'Create a new channel',
  })
  @ApiCustomResponse({
    status: HttpStatus.CREATED,
    model: Message,
  })
  @ApiConflictResponse({
    status: HttpStatus.CONFLICT,
    type: IErrorResponse,
  })
  @ApiParam({
    name: 'channelId',
    type: String,
    required: true,
  })
  @ApiBody({
    type: SendMessageDto,
    required: true,
  })
  public async sendMessage(
    @ReqUser() currentUser: User,
    @Param('channelId', MongoIdValidationPipe) channelId: ObjectId,
    @Body() messageData: SendMessageDto
  ): Promise<GenericResponse<Message>> {
    const existingChannel = await this.channelService.findChannelByIdAndUserId(
      channelId,
      currentUser.id
    );

    if (!existingChannel)
      throw new NotFoundException(`Channel with id ${channelId} not found.`);

    const message = await this.messageService.create(
      channelId,
      currentUser.id,
      messageData
    );

    return {
      success: true,
      payload: message,
    };
  }

  @Get()
  @ApiOperation({
    description: 'Get channel messages',
    summary: 'Get channels messages',
  })
  @ApiCustomResponse({
    status: HttpStatus.OK,
    model: Message,
    isArray: true,
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
  public async getChannelMessages(
    @ReqUser() currentUser: User,
    @Param('channelId', MongoIdValidationPipe) channelId: ObjectId
  ): Promise<GenericResponse<Message>> {
    const isUserExistInChannel = await this.channelService.findChannelByIdAndUserId(
      channelId,
      currentUser.id
    );

    if (!isUserExistInChannel)
      throw new ForbiddenException(`Permission denied. Alien channel.`);

    const messages = await this.messageService.getMessagesByChannelId(channelId);

    return {
      success: true,
      payload: messages,
    };
  }

  @Patch(':messageId')
  @ApiOperation({
    description: 'Update message by channel and message Id',
    summary: 'Update message',
  })
  @ApiCustomResponse({
    status: HttpStatus.OK,
    model: Message,
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
  @ApiParam({
    name: 'messageId',
    type: String,
    required: true,
  })
  @ApiBody({
    type: UpdateMessageDto,
    required: true,
  })
  public async updateMessage(
    @ReqUser() currentUser: User,
    @Param('channelId', MongoIdValidationPipe) channelId: ObjectId,
    @Param('messageId', MongoIdValidationPipe) messageId: ObjectId,
    @Body() updateData: UpdateMessageDto
  ): Promise<GenericResponse<Message>> {
    const existingMessage = await this.messageService.findMessageByIdAndChannelId(
      messageId,
      channelId
    );

    if (!existingMessage)
      throw new NotFoundException(`Message with id ${messageId} not found.`);

    if (!existingMessage.senderId.equals(currentUser.id))
      throw new ForbiddenException(`Permission denied. Alien message.`);

    const updatedMessage = await this.messageService.update(messageId, updateData);

    return {
      success: true,
      payload: updatedMessage!,
    };
  }

  @Delete(':messageId')
  @ApiOperation({
    description: 'Remove message by channel and message Id',
    summary: 'Remove message',
  })
  @ApiCustomResponse({
    status: HttpStatus.OK,
    model: Message,
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
  @ApiParam({
    name: 'messageId',
    type: String,
    required: true,
  })
  public async deleteMessage(
    @ReqUser() currentUser: User,
    @Param('channelId', MongoIdValidationPipe) channelId: ObjectId,
    @Param('messageId', MongoIdValidationPipe) messageId: ObjectId
  ): Promise<GenericResponse<Message>> {
    const existingMessage = await this.messageService.findMessageByIdAndChannelId(
      messageId,
      channelId
    );

    if (!existingMessage)
      throw new NotFoundException(`Message with id ${messageId} not found.`);

    if (!existingMessage.senderId.equals(currentUser.id))
      throw new ForbiddenException(`Permission denied. Alien message.`);

    await this.messageService.delete(messageId);

    return {
      success: true,
      payload: existingMessage,
    };
  }
}
