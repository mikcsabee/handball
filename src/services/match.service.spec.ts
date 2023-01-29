import { DataSource } from "typeorm";
import {
  createTestDatabaseResources,
  createTestDatasource,
  TestDatabaseResources
} from "../test/database";
import { Match } from "../entity";
import { MatchService } from "./match.service";

describe("MatchService", () => {
  let matchService: MatchService;
  let resources: TestDatabaseResources;
  let datasource: DataSource;
  let match: Match;

  beforeAll(async () => {
    datasource = await createTestDatasource();
  });

  beforeEach(async () => {
    resources = createTestDatabaseResources(datasource);
    matchService = resources.matchService;
    match = await resources.matchRepository.save({
      name: "Test Match",
      createdAt: Date.now(),
      finalized: false,
      numberOfPlayers: 8
    });
  });

  afterEach(async () => {
    await resources.clean();
  });

  afterAll(async () => {
    await datasource.destroy();
  });

  describe("findById", () => {
    it("should return a match by id", async () => {
      // Act
      const result = await matchService.findById(match.id as number);

      // Assert
      expect(result).toEqual(
        expect.objectContaining({
          id: match.id,
          name: match.name,
          numberOfPlayers: match.numberOfPlayers,
          finalized: match.finalized,
          teams: []
        })
      );
    });

    it("should return null if match does not exist", async () => {
      // Act
      const result = await matchService.findById(-1);

      // Assert
      expect(result).toBeNull();
    });
  });

  it("findAll", async () => {
    // Act
    const array = await matchService.findAll();

    // Assert
    expect(array.length).toBe(1);
    expect(array[0].id).toBe(match.id);
  });

  it("create", async () => {
    // Setup
    const entity = await matchService.create({
      name: "Test Match",
      createdAt: Date.now(),
      finalized: false,
      numberOfPlayers: 8
    });

    // Act
    const result = await matchService.findById(entity.id as number);

    // Assert
    expect(result).toEqual(
      expect.objectContaining({
        id: entity.id,
        finalized: false,
        numberOfPlayers: entity.numberOfPlayers
      })
    );
    expect(result?.teams?.length).toBe(2);
  });

  it("update", async () => {
    // Act
    await matchService.update(match.id as number, {
      ...match,
      name: "Updated",
      finalized: true
    });

    // Assert
    const result = await matchService.findById(match.id as number);

    expect(result).toEqual(
      expect.objectContaining({
        id: match.id,
        name: "Updated",
        finalized: true,
        numberOfPlayers: match.numberOfPlayers
      })
    );
  });
});
