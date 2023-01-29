import { NextFunction, Request, Response } from "express";
import {
  MatchPlayerTeamService,
  MatchService,
  PlayerScoreService,
  PlayerService,
  TeamService
} from "../services";
import { Services } from "../utils/use";
import { getPlayers, postPlayer, getPlayer, putPlayer } from "./player.route";

describe("player endpoints", () => {
  const player = { id: 1, name: "Arthur Dent", active: true };

  it("GET /player", async () => {
    // Setup
    const players = [player];
    const services: Services = {
      matchService: {} as unknown as MatchService,
      playerService: {
        findAll: jest.fn().mockResolvedValue(players)
      } as unknown as PlayerService,
      playerScoreService: {} as unknown as PlayerScoreService,
      matchPlayerTeamService: {} as unknown as MatchPlayerTeamService,
      teamService: {} as unknown as TeamService
    };
    const req = {
      headers: { authorization: "Bearer token" }
    } as unknown as Request;
    const res = { json: jest.fn() } as unknown as Response;
    const next = {} as unknown as NextFunction;

    // Act
    await getPlayers(req, res, next, services);

    // Assert
    expect(res.json).toHaveBeenCalledWith(players);
    expect(services.playerService.findAll).toHaveBeenCalledTimes(1);
  });

  it("POST /player", async () => {
    // Setup
    const services: Services = {
      matchService: {} as unknown as MatchService,
      playerService: {
        create: jest.fn().mockResolvedValue(player)
      } as unknown as PlayerService,
      playerScoreService: {} as unknown as PlayerScoreService,
      matchPlayerTeamService: {} as unknown as MatchPlayerTeamService,
      teamService: {} as unknown as TeamService
    };
    const req = {
      headers: { authorization: "Bearer token" },
      body: {
        name: "Arthur Dent"
      }
    } as unknown as Request;
    const res = { json: jest.fn() } as unknown as Response;
    const next = {} as unknown as NextFunction;

    // Act
    await postPlayer(req, res, next, services);

    // Assert
    expect(res.json).toHaveBeenCalledWith(player);
    expect(services.playerService.create).toHaveBeenCalledWith({
      active: true,
      name: player.name
    });
  });

  it("GET /player/:id", async () => {
    // Setup
    const services: Services = {
      matchService: {} as unknown as MatchService,
      playerService: {
        findById: jest.fn().mockResolvedValue(player)
      } as unknown as PlayerService,
      playerScoreService: {} as unknown as PlayerScoreService,
      matchPlayerTeamService: {} as unknown as MatchPlayerTeamService,
      teamService: {} as unknown as TeamService
    };
    const req = {
      headers: { authorization: "Bearer token" },
      params: { id: 1 }
    } as unknown as Request;
    const res = { json: jest.fn() } as unknown as Response;
    const next = {} as unknown as NextFunction;

    // Act
    await getPlayer(req, res, next, services);

    // Assert
    expect(res.json).toHaveBeenCalledWith(player);
    expect(services.playerService.findById).toHaveBeenCalledWith(1);
  });

  it("PUT /player/:id", async () => {
    // Setup
    const services: Services = {
      matchService: {} as unknown as MatchService,
      playerService: {
        findById: jest.fn().mockResolvedValue(player),
        update: jest.fn().mockResolvedValue(player)
      } as unknown as PlayerService,
      playerScoreService: {} as unknown as PlayerScoreService,
      matchPlayerTeamService: {} as unknown as MatchPlayerTeamService,
      teamService: {} as unknown as TeamService
    };
    const req = {
      headers: { authorization: "Bearer token" },
      params: { id: 1 },
      body: {
        name: player.name,
        active: false
      }
    } as unknown as Request;
    const res = { json: jest.fn() } as unknown as Response;
    const next = {} as unknown as NextFunction;

    // Act
    await putPlayer(req, res, next, services);

    // Assert
    expect(res.json).toHaveBeenCalledWith(player);
    expect(services.playerService.update).toHaveBeenCalledWith(1, player);
  });
});
