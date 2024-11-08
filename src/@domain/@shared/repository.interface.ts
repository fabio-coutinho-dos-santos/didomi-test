export interface IRespository<T> {
  create(entity: T): Promise<T>;
  findByField(field: string, value: unknown): Promise<T>;
}
