import { Repository } from "typeorm";
import { Team } from "../entity";
import { BaseService } from "./base.service";

/**
 * Class to handle the Team entity
 * @extends BaseService
 */
export class TeamService extends BaseService<Team> {
  public constructor(repository?: Repository<Team>) {
    super(Team, repository);
  }

  /**
   * findByMatchId finds the teams for a Match
   * @param matchId the Match id
   * @returns an array of Teams
   */
  async findByMatchId(matchId: number): Promise<Team[]> {
    return this.baseRepository.find({ where: { matchId } });
  }

  /**
   * Generates a name for a team
   * @returns a team name
   * @todo: add more words to the arrays
   */
  generateTeamName(): string {
    const adjectives = [
      "Awesome",
      "Cool",
      "Black",
      "Pink",
      "Red",
      "Golden",
      "Frozen",
      "Fiery",
      "Comsic",
      "Sleepy",
      "Drunken"
    ];
    const nouns = [
      "Cats",
      "Kittens",
      "Unicorns",
      "Monkeys",
      "Angels",
      "Devils",
      "Dwarfs",
      "Giants",
      "Ogres"
    ];
    const adverbs = [
      "OnTheMoon",
      "InTheKitchen",
      "InThePub",
      "OnTheBeach",
      "InTheForest"
    ];
    function getRandom(list: string[]) {
      return list[Math.floor(Math.random() * list.length)];
    }
    return `${getRandom(adjectives)}${getRandom(nouns)}${getRandom(adverbs)}`;
  }
}
