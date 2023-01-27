import { DataSource, DataSourceOptions } from "typeorm";
import * as options from ".,/../../ormconfig.json";
import { Match, MatchPlayerTeam, Player, PlayerScore, Team } from "../entity";

export const dataSource = new DataSource({
  ...(options as DataSourceOptions),
  entities: [Match, MatchPlayerTeam, Player, PlayerScore, Team]
});
