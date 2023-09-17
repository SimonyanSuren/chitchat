import { PickType } from '@nestjs/swagger';
import { SendMessageDto } from './send.dto';

export class UpdateMessageDto extends PickType(SendMessageDto, ['content'] as const) {}
