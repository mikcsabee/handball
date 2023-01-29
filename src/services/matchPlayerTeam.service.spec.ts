import { DataSource } from "typeorm";
import {
  createTestDatabaseResources,
  createTestDatasource,
  TestDatabaseResources
} from "../test/database";
import { Match, MatchPlayerTeam, Player, POSITIONS, Team } from "../entity";
import { MatchPlayerTeamService } from "./matchPlayerTeam.service";

describe("MatchPlayerTeamService", () => {
  let matchPlayerTeamService: MatchPlayerTeamService;
  let resources: TestDatabaseResources;
  let datasource: DataSource;
  let match: Match;
  let player: Player;
  let team: Team;
  let matchPlayerTeam: MatchPlayerTeam;

  beforeAll(async () => {
    datasource = await createTestDatasource();
  });

  beforeEach(async () => {
    resources = createTestDatabaseResources(datasource);
    matchPlayerTeamService = resources.matchPlayerTeamService;
    match = await resources.matchRepository.save({
      name: "Test Match",
      createdAt: Date.now(),
      finalized: false,
      numberOfPlayers: 8
    });
    player = await resources.playerRepository.save({
      name: "Arthur Dent",
      active: true
    });
    team = await resources.teamRepository.save({
      name: resources.teamService.generateTeamName(),
      point: 0,
      match,
      matchId: match.id
    });
    matchPlayerTeam = await resources.matchPlayerTeamRepository.save({
      matchId: match.id as number,
      playerId: player.id as number,
      teamId: team.id as number,
      match,
      player,
      team,
      position: POSITIONS[0]
    });
  });

  afterEach(async () => {
    await resources.clean();
  });

  afterAll(async () => {
    await datasource.destroy();
  });

  it("create", async () => {
    const player2 = await resources.playerRepository.save({
      name: "Ford Prefect",
      active: true
    });

    // Setup
    const entity = await matchPlayerTeamService.create({
      matchId: match.id as number,
      playerId: player2.id as number,
      teamId: team.id as number,
      match,
      player: player2,
      team,
      position: POSITIONS[1]
    });

    // Act
    const result = await resources.matchPlayerTeamRepository.findOne({
      where: { matchId: match.id, playerId: player2.id, teamId: team.id }
    });

    // Assert
    expect(result).toEqual(
      expect.objectContaining({
        playerId: entity.playerId,
        matchId: match.id,
        teamId: team.id,
        position: entity.position
      })
    );
  });

  describe("findByMatchIdAndPlayerId", () => {
    it("should return a matchPlayerTeam by matchId and playerId", async () => {
      // Act
      const result = await matchPlayerTeamService.findByMatchIdAndPlayerId(
        match.id as number,
        player.id as number
      );

      // Assert
      expect(result).toEqual(
        expect.objectContaining({
          playerId: player.id,
          matchId: match.id,
          teamId: team.id,
          position: matchPlayerTeam.position
        })
      );
    });

    it("should return null if matchId does not exist", async () => {
      // Act
      const result = await matchPlayerTeamService.findByMatchIdAndPlayerId(
        -1,
        player.id as number
      );

      // Assert
      expect(result).toBeNull();
    });

    it("should return null if playerId does not exist", async () => {
      // Act
      const result = await matchPlayerTeamService.findByMatchIdAndPlayerId(
        match.id as number,
        -1
      );

      // Assert
      expect(result).toBeNull();
    });
  });

  describe("findByMatchId", () => {
    it("should return matchPlayerTeams by matchId", async () => {
      // Act
      const array = await matchPlayerTeamService.findByMatchId(
        match.id as number
      );

      // Assert
      expect(array.length).toBe(1);
      expect(array[0].matchId).toBe(match.id);
    });

    it("should return an empty array if matchId does not exist", async () => {
      // Act
      const array = await matchPlayerTeamService.findByMatchId(-1);

      // Assert
      expect(array.length).toBe(0);
    });
  });

  describe("findPlayersByTeamId", () => {
    it("should return matchPlayerTeams by teamId", async () => {
      // Act
      const array = await matchPlayerTeamService.findPlayersByTeamId(
        team.id as number
      );

      // Assert
      expect(array.length).toBe(1);
      expect(array[0].id).toBe(player.id);
      expect(array[0].position).toBe(matchPlayerTeam.position);
    });

    it("should return an empty array if teamId does not exist", async () => {
      // Act
      const array = await matchPlayerTeamService.findPlayersByTeamId(-1);

      // Assert
      expect(array.length).toBe(0);
    });
  });
});
