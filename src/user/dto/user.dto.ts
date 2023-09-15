import {
  IsISO31661Alpha2,
  IsMobilePhone,
  IsOptional,
  IsPostalCode,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsOptionalButNotNull } from '../../common/decorators';

export class UpdateUserDto {
  @IsOptionalButNotNull()
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: '$property must contain only letters and numbers',
  })
  public nationalIdentificationId?: string;

  /**
   * ISO 3166-1 alpha-2 AM, US, UK, RU, etc.
   * @example AM
   */
  @IsString()
  @IsISO31661Alpha2()
  @IsOptionalButNotNull()
  readonly country?: string;

  @MaxLength(60)
  @MinLength(1)
  @IsOptional()
  readonly city?: string;

  @MaxLength(60)
  @MinLength(2)
  @IsOptional()
  readonly address1?: string;

  @MaxLength(60)
  @MinLength(2)
  @IsOptional()
  readonly address2?: string;

  @IsPostalCode('any')
  @IsOptional()
  readonly postalCode?: string;

  @IsMobilePhone()
  @IsOptionalButNotNull()
  readonly phoneNumber?: string;
}
