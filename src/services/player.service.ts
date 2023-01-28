import { In } from "typeorm";
import { Player } from "../entity";
import { BaseService } from "./base.service";

export class PlayerService extends BaseService<Player> {
  public constructor() {
    super(Player);
  }

  async findById(id: number): Promise<Player | null> {
    return this.baseRepository.findOne({
      where: { id },
      relations: ["scores"]
    });
  }

  async findByIds(ids: number[]): Promise<Player[]> {
    return await this.baseRepository.find({
      where: { id: In(ids), active: true },
      relations: ["scores"]
    });
  }
}
