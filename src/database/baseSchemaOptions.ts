/* eslint-disable @typescript-eslint/no-unused-vars */
import { CallbackWithoutResultAndOptionalError, Query, Schema } from 'mongoose';

type QueryWithConditions = Query<any, any, any> & {
  _conditions: {
    id?: string;
    _id?: string;
    [key: string]: any;
  };
};

export const mongooseBaseSchemaOptionsPlugin = (schema: Schema): void => {
  const schemaTimestamps =
    schema.get('timestamps') !== undefined ? schema.get('timestamps') : true;

  //schema.set('optimisticConcurrency', true);
  schema.set('timestamps', schemaTimestamps);
  schema.set('versionKey', false);
  schema.set('virtuals', true);
  schema.set('strict', 'throw');
  schema.set('toObject', {
    virtuals: true,
    getters: true,
    transform: (_doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  });
  schema.set('toJSON', {
    virtuals: true,
    getters: true,
    transform: (_doc, ret) => {
      if (ret._id) {
        ret.id = ret._id.toString();
        delete ret._id;
      }
      return ret;
    },
  });

  schema.pre(
    ['find', 'findOne', 'findOneAndUpdate', 'updateOne'],
    function (next: CallbackWithoutResultAndOptionalError) {
      if (
        (this as QueryWithConditions)._conditions &&
        (this as QueryWithConditions)._conditions.id
      ) {
        (this as QueryWithConditions)._conditions._id = (
          this as QueryWithConditions
        )._conditions.id;
        delete (this as QueryWithConditions)._conditions.id;
      }
      next();
    }
  );
};
