import { ValidateIf, ValidationOptions } from 'class-validator';

export function IsOptionalButNotNull(options?: ValidationOptions): PropertyDecorator {
  return ValidateIf((obj, v) => v !== undefined, options);
}
