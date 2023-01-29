import { ObjectLiteral, Repository } from "typeorm";
import { dataSource } from "../db/datasources";

/**
 * Base Abstract Entity handler service
 */
export abstract class BaseService<T extends ObjectLiteral> {
  protected baseRepository: Repository<T>;

  /**
   * Constructor
   * @param c the entity class type
   * @param repository the entity repository: optional in production, mandatory in testing
   */
  constructor(c: new () => T, repository?: Repository<T>) {
    if (repository) {
      this.baseRepository = repository;
    } else {
      this.baseRepository = dataSource.getRepository(c);
    }
  }

  /**
   * findALl
   * @returns all instances of the entity
   */
  async findAll(): Promise<T[]> {
    return this.baseRepository.find();
  }

  /**
   * findById
   * @param id: entity id
   * @returns a single instances of the entity by id or null
   */
  async findById(id: number): Promise<T | null> {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    return this.baseRepository.findOne({ where: { id } } as any);
  }

  /**
   * Create an Entity in the database
   * @param entity input entity
   * @returns the same entity with id
   */
  async create(entity: T): Promise<T> {
    return this.baseRepository.save(entity);
  }

  /**
   * Update an existing entity
   * @param id entity id
   * @param entity the fields to update
   */
  async update(id: number, entity: T): Promise<void> {
    await this.baseRepository.update(id, entity);
  }
}
