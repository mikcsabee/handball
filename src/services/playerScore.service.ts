import { Repository } from "typeorm";
import { Player, PlayerScore } from "../entity";
import { BaseService } from "./base.service";

/**
 * Class to handle the PlayerScore entity
 * @extends BaseService
 */
export class PlayerScoreService extends BaseService<PlayerScore> {
  public constructor(repository?: Repository<PlayerScore>) {
    super(PlayerScore, repository);
  }

  /**
   * findByPlayerId finds the PlayerScores for a Player
   * @param playerId the player id
   * @returns an array of PlayerScores
   */
  async findByPlayerId(playerId: number): Promise<PlayerScore[]> {
    return this.baseRepository.find({ where: { playerId } });
  }

  /**
   * One player on one position should only have one PlayerScore entity
   * This method checks that is that entity exisits already, and if it does,
   * then adds the poin value to it, otherwise creats the enttiy.
   * @param player Player
   * @param position Player Position
   * @param point Point to add
   * @returns The PlayerScore entity
   */
  async scorePlayer(
    player: Player,
    position: string,
    point: number
  ): Promise<PlayerScore> {
    const playerScore = await this.baseRepository.findOne({
      where: { playerId: player.id, position }
    });
    if (playerScore) {
      playerScore.point += point;
      await this.update(playerScore.id as number, playerScore);
      return playerScore;
    }
    return this.create({
      position,
      point,
      playerId: player.id as number,
      player
    });
  }
}
