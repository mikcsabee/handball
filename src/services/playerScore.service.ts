import { PlayerScore } from "../entity";
import { BaseService } from "./base.service";

export class PlayerScoreService extends BaseService<PlayerScore> {
  public constructor() {
    super(PlayerScore);
  }

  async findByPlayerId(playerId: number): Promise<PlayerScore[]> {
    return this.baseRepository.find({ where: { playerId } });
  }

  async findByPlayerIdAndPosition(
    playerId: number,
    position: string
  ): Promise<PlayerScore | null> {
    return this.baseRepository.findOne({ where: { playerId, position } });
  }
}
