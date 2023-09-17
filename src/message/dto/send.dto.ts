import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ValidateAndTransformMongoId } from '../../common/decorators';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(200)
  readonly content: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @ValidateAndTransformMongoId()
  readonly parentId: ObjectId;
}
