import { Team } from "../entity";
import { BaseService } from "./base.service";

export class TeamService extends BaseService<Team> {
  public constructor() {
    super(Team);
  }

  async findByMatchId(matchId: number): Promise<Team[]> {
    return this.baseRepository.find({ where: { matchId } });
  }

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
