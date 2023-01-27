import { Match } from "../entity";
import { BaseService } from "./base.service";
import { TeamService } from "./team.service";

export class MatchService extends BaseService<Match> {
  public constructor() {
    super(Match);
  }

  async create(entity: Match): Promise<Match> {
    const match = await super.create(entity);

    const teamService = new TeamService();
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
