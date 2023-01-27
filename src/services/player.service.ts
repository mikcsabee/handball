import { Player, PlayerScore } from "../entity";
import { BaseService } from "./base.service";

export class PlayerService extends BaseService<Player> {
  public constructor() {
    super(Player);
  }

  async findByIds(ids: number[]): Promise<Player[]> {
    const results = await this.baseRepository
      .createQueryBuilder("player")
      .where("player.id IN (:...ids) and player.active = true", { ids })
      .leftJoinAndMapMany(
        "player.scores",
        (qb) => qb.select().from(PlayerScore, "scores"),
        "score",
        "score.playerId = player.id"
      )
      .execute();

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const players: any = {};

    for (const r of results) {
      const id: number = r["player_id"];
      const player: Player = {
        id,
        name: r["player_name"],
        active: r["player_active"]
      };
      const score: PlayerScore = {
        id: r["id"],
        position: r["position"],
        point: r["point"],
        playerId: id
      };

      const p = players[id];
      if (p && score.id) {
        p.scores.push(score);
      } else if (!p) {
        if (score.id) {
          player.scores = [score];
        }

        players[id] = player;
      }
    }

    return Object.values(players);
  }
}
