import { Repository } from "typeorm";
import { dataSource } from "../db/datasources";
import { MatchPlayerTeam, Player } from "../entity";

interface P extends Player {
  position: string;
}

/**
 * Class to handle the MatchPlayerTeam entity
 */
export class MatchPlayerTeamService {
  private repository: Repository<MatchPlayerTeam> =
    dataSource.getRepository(MatchPlayerTeam);

  constructor(repository?: Repository<MatchPlayerTeam>) {
    if (repository) {
      this.repository = repository;
    } else {
      this.repository = dataSource.getRepository(MatchPlayerTeam);
    }
  }

  /**
   * Create an MatchPlayerTeam in the database
   * @param entity input entity
   * @returns the same entity with id
   */
  async create(entity: MatchPlayerTeam): Promise<MatchPlayerTeam> {
    return this.repository.save(entity);
  }

  /**
   * findByMatchIdAndPlayerId finds a MatchPlayerTeam by Match id and Player Id
   * @param matchId the match id
   * @param playerId the player id
   * @returns MatchPlayerTeam or null if not found
   */
  async findByMatchIdAndPlayerId(
    matchId: number,
    playerId: number
  ): Promise<MatchPlayerTeam | null> {
    return this.repository.findOne({ where: { matchId, playerId } });
  }

  /**
   * findByMatchId finds all MatchPlayerTeams for a Match Id
   * @param matchId the match id
   * @returns an array of MatchPlayerTeam
   */
  async findByMatchId(matchId: number): Promise<MatchPlayerTeam[]> {
    return this.repository.find({ where: { matchId } });
  }

  /**
   * findPlayersByTeamId for a teamId finds all Players + the Player Position on that Match
   * @param teamId the team id
   * @returns an array of Players + position
   */
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
