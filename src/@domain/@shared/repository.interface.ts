export interface IRespository<T> {
  create(entity: T): Promise<T>;
}
