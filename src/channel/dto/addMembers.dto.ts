import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray } from 'class-validator';
import { ValidateAndTransformMongoId } from '../../common/decorators';

export class AddMembersDto {
  /**
   * User Ids to add to channel.
   */
  @ApiProperty({ type: String, isArray: true })
  @IsArray()
  @ArrayUnique()
  // Maximum members allowed to be added
  @ArrayMaxSize(10)
  @ArrayMinSize(1)
  @ValidateAndTransformMongoId({
    each: true,
    message: 'each value in memberIds must be a valid MongoDB Id',
  })
  readonly memberIds: ObjectId[];
}
