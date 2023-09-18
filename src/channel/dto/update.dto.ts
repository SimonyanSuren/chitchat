import { PickType } from '@nestjs/swagger';
import { CreateChannelDto } from './create.dto';

export class UpdateChannelDto extends PickType(CreateChannelDto, ['name'] as const) {}
