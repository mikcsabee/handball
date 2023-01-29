import { DataSource } from "typeorm";
import {
  createTestDatabaseResources,
  createTestDatasource,
  TestDatabaseResources
} from "../test/database";
import { Player, PlayerScore, POSITIONS } from "../entity";
import { PlayerService } from "./player.service";

describe("PlayerService", () => {
  let playerService: PlayerService;
  let resources: TestDatabaseResources;
  let datasource: DataSource;
  let player: Player;
  let playerScore: PlayerScore;

  beforeAll(async () => {
    datasource = await createTestDatasource();
  });

  beforeEach(async () => {
    resources = createTestDatabaseResources(datasource);
    playerService = resources.playerService;
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
    it("should return a player by id", async () => {
      // Act
      const result = await playerService.findById(player.id as number);

      // Assert
      expect(result).toEqual(
        expect.objectContaining({
          id: player.id,
          name: player.name,
          active: player.active
        })
      );
      expect(result?.scores?.at(0)).toEqual(
        expect.objectContaining({
          id: playerScore.id,
          position: playerScore.position,
          point: playerScore.point,
          playerId: player.id
        })
      );
    });

    it("should return null if match does not exist", async () => {
      // Act
      const result = await playerService.findById(-1);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe("findByIds", () => {
    it("should return an array of players by ids", async () => {
      // Act
      const result = await playerService.findByIds([player.id as number]);

      // Assert
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: player.id,
          name: player.name,
          active: player.active
        })
      );
      expect(result[0].scores?.at(0)).toEqual(
        expect.objectContaining({
          id: playerScore.id,
          position: playerScore.position,
          point: playerScore.point,
          playerId: player.id
        })
      );
    });

    it("should filter non active players", async () => {
      // Setup
      player.active = false;
      await playerService.update(player.id as number, player);

      // Act
      const result = await playerService.findByIds([player.id as number]);

      // Assert
      expect(result.length).toBe(0);
    });

    it("should return an empty array if match does not exist", async () => {
      // Act
      const result = await playerService.findByIds([-1]);

      // Assert
      expect(result.length).toBe(0);
    });
  });
});
