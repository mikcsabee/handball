import { DataSource, DataSourceOptions, Repository } from "typeorm";
import * as options from ".,/../../ormconfig.json";
import { Match, MatchPlayerTeam, Player, PlayerScore, Team } from "../entity";
import {
  MatchPlayerTeamService,
  MatchService,
  PlayerScoreService,
  PlayerService,
  TeamService
} from "../services";

export async function createTestDatasource() {
  const config = {
    ...options,
    database: options.testDatabase,
    // logging: true,
    entities: [Match, MatchPlayerTeam, Player, PlayerScore, Team]
  } as DataSourceOptions;
  const dataSource = new DataSource(config);
  return dataSource.initialize();
}

export class TestDatabaseResources {
  constructor(
    public matchRepository: Repository<Match>,
    public matchPlayerTeamRepository: Repository<MatchPlayerTeam>,
    public playerRepository: Repository<Player>,
    public playerScoreRepository: Repository<PlayerScore>,
    public teamRepository: Repository<Team>,

    public matchService: MatchService,
    public matchPlayerTeamService: MatchPlayerTeamService,
    public playerService: PlayerService,
    public playerScoreService: PlayerScoreService,
    public teamService: TeamService
  ) {}

  public async clean(): Promise<void> {
    await this.matchPlayerTeamRepository.delete({});
    await this.playerScoreRepository.delete({});
    await this.teamRepository.delete({});
    await this.matchRepository.delete({});
    await this.playerRepository.delete({});
  }
}

export function createTestDatabaseResources(
  datasource: DataSource
): TestDatabaseResources {
  const matchRepository = datasource.getRepository(Match);
  const matchPlayerTeamRepository = datasource.getRepository(MatchPlayerTeam);
  const playerRepository = datasource.getRepository(Player);
  const playerScoreRepository = datasource.getRepository(PlayerScore);
  const teamRepository = datasource.getRepository(Team);

  const matchService = new MatchService(matchRepository, teamRepository);
  const matchPlayerTeamService = new MatchPlayerTeamService(
    matchPlayerTeamRepository
  );
  const playerService = new PlayerService(playerRepository);
  const playerScoreService = new PlayerScoreService(playerScoreRepository);
  const teamService = new TeamService(teamRepository);

  return new TestDatabaseResources(
    matchRepository,
    matchPlayerTeamRepository,
    playerRepository,
    playerScoreRepository,
    teamRepository,
    matchService,
    matchPlayerTeamService,
    playerService,
    playerScoreService,
    teamService
  );
}
