import { Repository } from "typeorm";
import { Match, Team } from "../entity";
import { BaseService } from "./base.service";
import { TeamService } from "./team.service";

/**
 * Class to handle the Match entity
 * @extends BaseService
 */
export class MatchService extends BaseService<Match> {
  private teamRepository?: Repository<Team>;

  public constructor(
    repository?: Repository<Match>,
    teamRepository?: Repository<Team>
  ) {
    super(Match, repository);
    this.teamRepository = teamRepository;
  }

  /**
   * findById
   * @param entity id
   * @returns a single Match instance plus the teams relations
   */
  async findById(id: number): Promise<Match | null> {
    return this.baseRepository.findOne({ where: { id }, relations: ["teams"] });
  }

  /**
   * Create the Match entity in the database. It will automatically creates two Teams entity for the Match
   * @param entity the Match entity
   * @returns the Match entity with id and the two teams
   */
  async create(entity: Match): Promise<Match> {
    const match = await super.create(entity);

    const teamService = new TeamService(this.teamRepository);
    const teamA = await teamService.create({
      name: teamService.generateTeamName(),
      point: 0,
      matchId: match.id as number,
      match,
      type: "TeamA"
    });
    const teamB = await teamService.create({
      name: teamService.generateTeamName(),
      point: 0,
      matchId: match.id as number,
      match,
      type: "TeamB"
    });

    delete teamA.match;
    delete teamB.match;

    match.teams = [teamA, teamB];
    return match;
  }
}
