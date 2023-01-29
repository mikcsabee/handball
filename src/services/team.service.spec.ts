import { DataSource } from "typeorm";
import {
  createTestDatabaseResources,
  createTestDatasource,
  TestDatabaseResources
} from "../test/database";
import { Match, Team } from "../entity";
import { TeamService } from "./team.service";

describe("TeamService", () => {
  let teamService: TeamService;
  let resources: TestDatabaseResources;
  let datasource: DataSource;
  let team: Team;
  let match: Match;

  beforeAll(async () => {
    datasource = await createTestDatasource();
  });

  beforeEach(async () => {
    resources = createTestDatabaseResources(datasource);
    teamService = resources.teamService;
    match = await resources.matchRepository.save({
      name: "Test Match",
      createdAt: Date.now(),
      finalized: false,
      numberOfPlayers: 8
    });
    team = await resources.teamRepository.save({
      name: teamService.generateTeamName(),
      point: 0,
      matchId: match.id as number,
      match,
      type: "TeamA"
    });
  });

  afterEach(async () => {
    await resources.clean();
  });

  afterAll(async () => {
    await datasource.destroy();
  });

  describe("findByMatchId", () => {
    it("should return a team by matchId", async () => {
      // Act
      const result = await teamService.findByMatchId(match.id as number);

      // Assert
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: team.id,
          name: team.name,
          point: team.point,
          matchId: team.matchId,
          type: team.type
        })
      );
    });

    it("should return an empty array if match does not exist", async () => {
      // Act
      const result = await teamService.findByMatchId(-1);

      // Assert
      expect(result.length).toBe(0);
    });
  });

  it("generateTeamName", () => {
    expect(teamService.generateTeamName().length).toBeGreaterThan(3);
  });
});
