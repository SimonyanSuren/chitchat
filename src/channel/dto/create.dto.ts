import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { OneMemberIfPrivate, ValidateAndTransformMongoId } from '../../common/decorators';

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  /**
   * Default value for isPrivate is false while creating a new channel.
   */
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  readonly isPrivate = false;

  /**
   * User Ids to add to channel.
   */
  @ApiProperty({ type: String, isArray: true })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  // Maximum members allowed to be added
  @ArrayMaxSize(10)
  @ArrayMinSize(1)
  @ValidateAndTransformMongoId({
    each: true,
    message: 'each value in memberIds must be a valid MongoDB Id',
  })
  @OneMemberIfPrivate()
  readonly memberIds?: ObjectId[];
}
