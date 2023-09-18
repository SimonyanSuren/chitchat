/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Aggregate,
  AggregateOptions,
  Document,
  FilterQuery,
  InferId,
  InsertManyOptions,
  Model,
  PipelineStage,
  ProjectionType,
  Query,
  QueryOptions,
  QueryWithHelpers,
  SaveOptions,
  UpdateQuery,
  UpdateWithAggregationPipeline,
  UpdateWriteOpResult,
  mongo,
} from 'mongoose';
import { IPagination } from '../../common/interfaces/pagination.interface';
import { IBaseRepository } from './base.repository.interface';

export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
  protected readonly _model: Model<T>;

  protected constructor(model: Model<T>) {
    this._model = model;
  }

  public async create(data: Omit<T, keyof Document>, options?: SaveOptions): Promise<T> {
    const createdModel = new this._model(data);
    return createdModel.save(options);
  }

  public async insertMany(
    data: Array<Omit<T, keyof Document>>,
    options?: InsertManyOptions
  ): Promise<T[]> {
    const insertedDocuments = await this._model.insertMany(data, options || {});
    return insertedDocuments as unknown as T[];
  }

  public find(
    filter: FilterQuery<T>,
    options?: QueryOptions<T> | null,
    projection?: ProjectionType<T> | null
  ): QueryWithHelpers<T[], T> {
    return this._model.find(filter, projection, options);
  }

  public findOne(
    filter: FilterQuery<T>,
    options?: QueryOptions<T> | null,
    projection?: ProjectionType<T> | null
  ): QueryWithHelpers<T | null, T> {
    return this._model.findOne(filter, projection, options);
  }

  public async findAll(): Promise<T[]> {
    return this._model.find().exec();
  }

  public findById(
    id: ObjectId | string,
    options?: QueryOptions<T> | null,
    projection?: ProjectionType<T> | null
  ): QueryWithHelpers<T | null, T> {
    return this._model.findById(id, projection, options);
  }

  public async findWithPagination(
    filter: FilterQuery<T>,
    paginationOptions: { page: number; pageSize: number },
    options?: QueryOptions<T>,
    projection?: ProjectionType<T> | null
  ): Promise<IPagination<T>> {
    const { page, pageSize } = paginationOptions;
    const totalCount = await this._model.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / pageSize);

    const data = await this._model.find(filter, projection, {
      skip: (page - 1) * pageSize,
      limit: pageSize,
      ...options,
    });

    return {
      data,
      pageSize,
      totalCount,
      totalPages,
      currentPage: page,
    };
  }

  public findByIdAndUpdate(
    id: ObjectId | string,
    data: Partial<T>,
    options?: QueryOptions<T>
  ): Promise<T | null> {
    return this._model.findByIdAndUpdate(id, data, { ...options, new: true });
  }

  public findOneAndUpdate(
    filter?: FilterQuery<T>,
    update?: UpdateQuery<T>,
    options?: QueryOptions<T>
  ): Promise<T | null> {
    return this._model.findOneAndUpdate(filter, update, options).exec();
  }

  public updateOne(
    filter?: FilterQuery<T>,
    update?: UpdateQuery<T> | UpdateWithAggregationPipeline,
    options?: QueryOptions<T> | null
  ): Query<UpdateWriteOpResult | null, T> {
    return this._model.updateOne<T>(filter, update, options);
  }

  public async exists({
    id,
    ...filter
  }: FilterQuery<T>): Promise<{ _id: InferId<T> } | null> {
    return this._model.exists({ ...(id ? { _id: id } : {}), ...filter }).exec();
  }

  public async deleteById(
    id: ObjectId | string,
    options?: QueryOptions<T> | null
  ): Promise<T | null> {
    return this._model.findByIdAndDelete(id, options).exec();
  }

  public deleteMany(
    filter?: FilterQuery<T>,
    options?: QueryOptions<T>
  ): QueryWithHelpers<mongo.DeleteResult, T, any> {
    return this._model.deleteMany(filter, options).exec();
  }

  public aggregate(
    pipeline?: PipelineStage[],
    options?: AggregateOptions
  ): Aggregate<Array<T>> {
    return this._model.aggregate(pipeline, options);
  }
}
