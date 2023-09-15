import { ClassSerializerInterceptor, PlainLiteralObject } from '@nestjs/common';
import {
  ClassConstructor,
  ClassTransformOptions,
  plainToInstance,
} from 'class-transformer';
import { Document } from 'mongoose';
import { GenericResponse } from '../interfaces/response.interface';

function MongooseClassSerializer<T>(
  classToIntercept: ClassConstructor<T>
): typeof ClassSerializerInterceptor {
  return class Interceptor extends ClassSerializerInterceptor {
    private changePlainObjectToClass(payload: PlainLiteralObject): PlainLiteralObject {
      if (!(payload instanceof Document)) {
        return payload;
      }

      return plainToInstance<T, PlainLiteralObject>(classToIntercept, payload.toJSON());
    }

    private prepareResponse(payload: PlainLiteralObject | PlainLiteralObject[]) {
      if (Array.isArray(payload)) {
        return payload.map(this.changePlainObjectToClass);
      }

      return this.changePlainObjectToClass(payload);
    }

    serialize(
      response: GenericResponse<PlainLiteralObject>,
      options: ClassTransformOptions
    ): PlainLiteralObject | PlainLiteralObject[] {
      response.payload = super.serialize(this.prepareResponse(response.payload), options);
      return response;
    }
  };
}

export default MongooseClassSerializer;
