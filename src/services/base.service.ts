import { ObjectLiteral, Repository } from "typeorm";
import { dataSource } from "../db/datasources";

export class BaseService<T extends ObjectLiteral> {
  protected baseRepository: Repository<T>;

  constructor(c: new () => T) {
    this.baseRepository = dataSource.getRepository(c);
  }

  async findAll(): Promise<T[]> {
    return this.baseRepository.find();
  }

  async findById(id: number): Promise<T | null> {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    return this.baseRepository.findOne({ where: { id } } as any);
  }

  async create(entity: T): Promise<T> {
    return this.baseRepository.save(entity);
  }

  async update(id: number, entity: T): Promise<void> {
    await this.baseRepository.update(id, entity);
  }
}
