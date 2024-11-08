import { IRespository } from 'src/@domain/@shared/repository.interface';
import { FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class BaseRepository<T> implements IRespository<T> {
  private repository: Repository<T>;

  protected constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async update(entity: QueryDeepPartialEntity<T>, id: string): Promise<T> {
    await this.repository.update(id, entity);
    return await this.findByField('id', id);
  }

  async findByField(field: string, value: unknown): Promise<T> {
    return await this.repository.findOne({
      where: { [field]: value } as FindOptionsWhere<T>,
    });
  }

  async create(data: T | any): Promise<T> {
    return await this.repository.save(data);
  }
}
