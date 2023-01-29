import { In, Repository } from "typeorm";
import { Player } from "../entity";
import { BaseService } from "./base.service";

/**
 * Class to handle the Player entity
 * @extends BaseService
 */
export class PlayerService extends BaseService<Player> {
  public constructor(repository?: Repository<Player>) {
    super(Player, repository);
  }

  /**
   * findById
   * @param entity player id
   * @returns a single Player instance plus the scores relations
   */
  async findById(id: number): Promise<Player | null> {
    return this.baseRepository.findOne({
      where: { id },
      relations: ["scores"]
    });
  }

  /**
   * findById finds an array of Player + scores relation for a given array of ids.
   * @param entity an array of player id
   * @returns an array of Player instance plus the scores relations
   */
  async findByIds(ids: number[]): Promise<Player[]> {
    return await this.baseRepository.find({
      where: { id: In(ids), active: true },
      relations: ["scores"]
    });
  }
}
