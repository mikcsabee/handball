import { Repository } from "typeorm";
import { dataSource } from "../db/datasources";
import { MatchPlayerTeam } from "../entity";

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
}
