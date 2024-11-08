import { IRespository } from 'src/@domain/@shared/repository.interface';
import { Repository } from 'typeorm';

export abstract class BaseRepository<T> implements IRespository<T> {
  private repository: Repository<T>;

  protected constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  async create(data: T | any): Promise<T> {
    return await this.repository.save(data);
  }
}
