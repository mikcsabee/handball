import { Repository } from "typeorm";
import { dataSource } from "../db/datasources";
import { MatchPlayerTeam, Player } from "../entity";

interface P extends Player {
  position: string;
}

export class MatchPlayerTeamService {
  protected repository: Repository<MatchPlayerTeam> =
    dataSource.getRepository(MatchPlayerTeam);

  async create(entity: MatchPlayerTeam): Promise<MatchPlayerTeam> {
    return this.repository.save(entity);
  }

  async findByMatchIdAndPlayerId(
    matchId: number,
    playerId: number
  ): Promise<MatchPlayerTeam | null> {
    return this.repository.findOne({ where: { matchId, playerId } });
  }

  async findByMatchId(matchId: number): Promise<MatchPlayerTeam[]> {
    return this.repository.find({ where: { matchId } });
  }

  async findPlayersByTeamId(teamId: number): Promise<P[]> {
    const matchPlayerTeam = await this.repository.find({
      where: { teamId },
      relations: ["player", "player.scores"]
    });

    return matchPlayerTeam.map((matchPlayerTeam) => ({
      ...matchPlayerTeam.player,
      position: matchPlayerTeam.position
    }));
  }
}
