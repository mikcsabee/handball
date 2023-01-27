import { DataSource, DataSourceOptions } from "typeorm";
import * as options from ".,/../../ormconfig.json";
import { Match, MatchPlayerTeam, Player, PlayerScore, Team } from "../entity";

const config: DataSourceOptions = {
  ...(options as DataSourceOptions),
  entities: [Match, MatchPlayerTeam, Player, PlayerScore, Team]
};

if (process.env.DB_HOST) {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  (config as any).host = process.env.DB_HOST;
}

export const dataSource = new DataSource(config);
