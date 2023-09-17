/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ValidationArguments,
  ValidationOptions,
  isMongoId,
  registerDecorator,
} from 'class-validator';
import { Types } from 'mongoose';

export function ValidateAndTransformMongoId(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: 'validateAndTransformMongoId',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const initialValue = args.object[propertyName];
          let validatedValue: ObjectId | ObjectId[];

          if (isMongoId(value)) {
            if (validationOptions?.each && Array.isArray(initialValue)) {
              validatedValue =
                initialValue.indexOf(value) === 0
                  ? [new Types.ObjectId(value)]
                  : [new Types.ObjectId(value), ...initialValue];
            } else {
              validatedValue = new Types.ObjectId(value);
            }

            args.object[propertyName] = validatedValue;
            return true;
          }

          return false;
        },
        defaultMessage() {
          return '$property is invalid MongoDB Id.';
        },
      },
    });
  };
}
