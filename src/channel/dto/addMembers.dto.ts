import { PickType } from '@nestjs/swagger';
import { CreateChannelDto } from './create.dto';

export class AddMembersDto extends PickType(CreateChannelDto, ['memberIds'] as const) {}
