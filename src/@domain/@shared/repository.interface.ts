import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface IRespository<T> {
  create(entity: T): Promise<T>;
  findByField(field: string, value: unknown): Promise<T>;
  delete(id: string): Promise<void>;
  update(entity: QueryDeepPartialEntity<T>, id: string): Promise<T>;
}
