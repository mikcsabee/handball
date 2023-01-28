import { In } from "typeorm";
import { Player } from "../entity";
import { BaseService } from "./base.service";

export class PlayerService extends BaseService<Player> {
  public constructor() {
    super(Player);
  }

  async findByIds(ids: number[]): Promise<Player[]> {
    return await this.baseRepository.find({
      where: { id: In(ids) },
      relations: ["scores"]
    });
  }
}
