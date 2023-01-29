import { NextFunction, Request, Response } from "express";
import { POSITIONS } from "../entity";
import {
  MatchPlayerTeamService,
  MatchService,
  PlayerScoreService,
  PlayerService,
  TeamService
} from "../services";
import { Services } from "../utils/use";
import { putScore } from "./score.route";

describe("score endpoints", () => {
  it("POST /score", async () => {
    // Setup
    const services: Services = {
      matchService: {
        findById: jest.fn().mockResolvedValue({
          name: "Test Match",
          createdAt: 1,
          finalized: false,
          numberOfPlayers: 8
        })
      } as unknown as MatchService,
      playerService: {
        findById: jest
          .fn()
          .mockResolvedValue({ id: 1, name: "Arthur Dent", active: true })
      } as unknown as PlayerService,
      playerScoreService: {
        scorePlayer: jest.fn().mockResolvedValue({
          id: 1,
          point: 2,
          position: POSITIONS[0],
          playerId: 1
        })
      } as unknown as PlayerScoreService,
      matchPlayerTeamService: {
        findByMatchIdAndPlayerId: jest.fn().mockResolvedValue({
          matchId: 1,
          playerId: 1,
          teamId: 1,
          position: POSITIONS[0]
        })
      } as unknown as MatchPlayerTeamService,
      teamService: {
        findById: jest.fn().mockResolvedValue({
          id: 1,
          name: "Team",
          point: 0,
          type: "teamA",
          matchId: 1
        }),
        update: jest.fn().mockResolvedValue({
          id: 1,
          name: "Team",
          point: 2,
          type: "teamA",
          matchId: 1
        })
      } as unknown as TeamService
    };

    const req = {
      params: { id: 1 },
      headers: { authorization: "Bearer token" },
      body: {
        matchId: 1,
        playerId: 1,
        point: 2
      }
    } as unknown as Request;
    const res = { json: jest.fn() } as unknown as Response;
    const next = {} as unknown as NextFunction;

    // Act
    await putScore(req, res, next, services);

    // Assert
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      playerId: 1,
      point: 2,
      position: "GOALKEEPER"
    });
    expect(services.playerScoreService.scorePlayer).toHaveBeenCalledWith(
      {
        active: true,
        id: 1,
        name: "Arthur Dent"
      },
      "GOALKEEPER",
      2
    );
    expect(services.teamService.update).toHaveBeenCalledWith(1, {
      id: 1,
      matchId: 1,
      name: "Team",
      point: 2,
      type: "teamA"
    });
  });
});
