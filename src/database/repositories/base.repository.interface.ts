import {
  Aggregate,
  AggregateOptions,
  Document,
  FilterQuery,
  InferId,
  InsertManyOptions,
  PipelineStage,
  ProjectionType,
  Query,
  QueryOptions,
  QueryWithHelpers,
  UpdateQuery,
  UpdateWithAggregationPipeline,
  UpdateWriteOpResult,
  mongo,
} from 'mongoose';
import { IPagination } from '../../common/interfaces/pagination.interface';

export interface IBaseRepository<T extends Document> {
  create(data: Omit<T, keyof Document>): Promise<T>;
  insertMany(
    data: Array<Omit<T, keyof Document>>,
    options?: InsertManyOptions
  ): Promise<Array<T>>;
  find(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T> | null | undefined,
    options?: QueryOptions<T> | null | undefined
  ): QueryWithHelpers<T[], T>;
  findOne(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T> | null | undefined,
    options?: QueryOptions<T> | null | undefined
  ): QueryWithHelpers<T | null, T>;
  findByIdAndUpdate(
    id: ObjectId | string,
    data: Partial<T>,
    options: QueryOptions<T>
  ): Promise<T | null>;
  findOneAndUpdate(
    filter?: FilterQuery<T>,
    update?: UpdateQuery<T>,
    options?: QueryOptions<T>
  ): Promise<T | null>;
  findAll(): Promise<T[]>;
  findById(id: ObjectId | string): QueryWithHelpers<T | null, T>;
  findWithPagination(
    filter: FilterQuery<T>,
    paginationOptions: { page: number; pageSize: number },
    options?: QueryOptions<T>,
    projection?: ProjectionType<T> | null
  ): Promise<IPagination<T>>;
  updateOne(
    filter?: FilterQuery<T>,
    update?: UpdateQuery<T> | UpdateWithAggregationPipeline,
    options?: QueryOptions<T> | null
  ): Query<UpdateWriteOpResult | null, T>;
  exists({ id, ...filter }: FilterQuery<T>): Promise<{ _id: InferId<T> } | null>;
  deleteById(id: ObjectId | string): Promise<T | null>;
  deleteMany(
    filter?: FilterQuery<T>,
    options?: QueryOptions<T>
  ): QueryWithHelpers<mongo.DeleteResult, T, any>;
  aggregate(pipeline?: PipelineStage[], options?: AggregateOptions): Aggregate<Array<T>>;
}
