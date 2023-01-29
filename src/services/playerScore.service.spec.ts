import { DataSource } from "typeorm";
import {
  createTestDatabaseResources,
  createTestDatasource,
  TestDatabaseResources
} from "../test/database";
import { Player, PlayerScore, POSITIONS } from "../entity";
import { PlayerScoreService } from "./playerScore.service";

describe("PlayerScoreService", () => {
  let playerScoreService: PlayerScoreService;
  let resources: TestDatabaseResources;
  let datasource: DataSource;
  let player: Player;
  let playerScore: PlayerScore;

  beforeAll(async () => {
    datasource = await createTestDatasource();
  });

  beforeEach(async () => {
    resources = createTestDatabaseResources(datasource);
    playerScoreService = resources.playerScoreService;
    player = await resources.playerRepository.save({
      name: "Arthur Dent",
      active: true
    });
    playerScore = await resources.playerScoreRepository.save({
      position: POSITIONS[0],
      point: 1,
      playerId: player.id as number,
      player
    });
  });

  afterEach(async () => {
    await resources.clean();
  });

  afterAll(async () => {
    await datasource.destroy();
  });

  describe("findById", () => {
    it("should return a playerScore by id", async () => {
      // Act
      const result = await playerScoreService.findById(
        playerScore.id as number
      );

      // Assert
      expect(result).toEqual(
        expect.objectContaining({
          id: playerScore.id,
          point: playerScore.point,
          position: playerScore.position,
          playerId: playerScore.playerId
        })
      );
    });

    it("should return null if playerScore does not exist", async () => {
      // Act
      const result = await playerScoreService.findById(-1);

      // Assert
      expect(result).toBeNull();
    });
  });

  it("create", async () => {
    // Setup
    const entity = await playerScoreService.create({
      position: POSITIONS[1],
      point: 1,
      playerId: player.id as number,
      player
    });

    // Act
    const result = await playerScoreService.findById(entity.id as number);

    // Assert
    expect(result).toEqual(
      expect.objectContaining({
        id: entity.id,
        point: entity.point,
        position: entity.position,
        playerId: entity.playerId
      })
    );
  });

  describe("findByPlayerId", () => {
    it("should return a playerScore by playerId", async () => {
      // Act
      const result = await playerScoreService.findByPlayerId(
        player.id as number
      );

      // Assert
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: playerScore.id,
          position: playerScore.position,
          point: playerScore.point,
          playerId: player.id
        })
      );
    });

    it("should return an empty array if match does not exist", async () => {
      // Act
      const result = await playerScoreService.findByPlayerId(-1);

      // Assert
      expect(result.length).toBe(0);
    });
  });
  describe("scorePlayer", () => {
    it("update an existing playerScore", async () => {
      // Act
      await playerScoreService.scorePlayer(player, playerScore.position, 10);

      // Assert
      const result = await playerScoreService.findById(
        playerScore.id as number
      );

      // Assert
      expect(result).toEqual(
        expect.objectContaining({
          id: playerScore.id,
          position: playerScore.position,
          point: playerScore.point + 10,
          playerId: player.id
        })
      );
    });

    it("create a new playerScore", async () => {
      // Act
      const entity = await playerScoreService.scorePlayer(
        player,
        POSITIONS[1],
        5
      );

      // Assert
      const result = await playerScoreService.findById(entity.id as number);

      // Assert
      expect(result).toEqual(
        expect.objectContaining({
          id: entity.id,
          position: POSITIONS[1],
          point: 5,
          playerId: player.id
        })
      );
      expect(entity.id).not.toBeNull();
      expect(entity.id).not.toBe(playerScore.id);
    });
  });
});
