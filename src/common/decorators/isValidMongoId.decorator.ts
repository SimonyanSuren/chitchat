import {
  ValidationArguments,
  ValidationOptions,
  isMongoId,
  registerDecorator,
} from 'class-validator';
import { Types } from 'mongoose';

export function ValidateAndTransformMongoId(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'ValidateAndTransformMongoId',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (
            isMongoId(value) &&
            (args.object[args.property] = new Types.ObjectId(value))
          )
            return true;

          return false;
        },
        defaultMessage(args: ValidationArguments) {
          return '$property is invalid MongoDB Id.';
        },
      },
    });
  };
}
