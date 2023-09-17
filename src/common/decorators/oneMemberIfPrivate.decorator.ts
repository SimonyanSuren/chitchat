/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export function OneMemberIfPrivate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: 'oneMemberIfPrivate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const isPrivate = (args.object as any)?.isPrivate || false;
          const memberIds = value;

          if (isPrivate && (!Array.isArray(memberIds) || memberIds.length !== 1)) {
            return false;
          }

          return true;
        },
        defaultMessage() {
          return `$property must have exactly one id in the array if isPrivate is true`;
        },
      },
    });
  };
}
