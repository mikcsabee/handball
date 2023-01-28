import { DataSource, DataSourceOptions } from "typeorm";
import * as options from ".,/../../ormconfig.json";
import { Match, MatchPlayerTeam, Player, PlayerScore, Team } from "../entity";

/**
 * Parse the ormconfig.json
 * The reason why I use json configuration is because it's open more
 * opportunities, for example use the TypeoORM cli, which for example a nice
 * tool to create and manage database migrations. The main difference is that
 * when we run TypeORM cli, we need to reference the entites as a path, while
 * when we compiling it with tsc, we need to referenc the entities as an array
 */
const config: DataSourceOptions = {
  ...(options as DataSourceOptions),
  entities: [Match, MatchPlayerTeam, Player, PlayerScore, Team]
};

/**
 * The DB_HOST environment variable can overwrite the ormconfig.json host
 * value. In this way, we can refer the database from docker-compose.
 */
if (process.env.DB_HOST) {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  (config as any).host = process.env.DB_HOST;
}

/**
 * TypeOrm DataSource configuration
 */
export const dataSource = new DataSource(config);
