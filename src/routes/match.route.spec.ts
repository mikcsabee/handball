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
import { getMatch, getMatches, postMatch, putMatchAdd } from "./match.route";

describe("matches endpoints", () => {
  const match = {
    id: 1,
    name: "The Match",
    createdAt: Date.now(),
    finalized: false,
    numberOfPlayers: 6,
    teams: [
      {
        id: 1,
        name: "Team A",
        point: 0,
        type: "TeamA"
      },
      {
        id: 1,
        name: "Team B",
        point: 0,
        type: "TeamB"
      }
    ]
  };

  it("GET /match", async () => {
    // Setup
    const matches = [match];
    const services: Services = {
      matchService: {
        findAll: jest.fn().mockResolvedValue(matches)
      } as unknown as MatchService,
      playerService: {} as unknown as PlayerService,
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
    await getMatches(req, res, next, services);

    // Assert
    expect(res.json).toHaveBeenCalledWith(matches);
    expect(services.matchService.findAll).toHaveBeenCalledTimes(1);
  });

  it("POST /match", async () => {
    // Setup
    const services: Services = {
      matchService: {
        create: jest.fn().mockResolvedValue(match)
      } as unknown as MatchService,
      playerService: {} as unknown as PlayerService,
      playerScoreService: {} as unknown as PlayerScoreService,
      matchPlayerTeamService: {} as unknown as MatchPlayerTeamService,
      teamService: {} as unknown as TeamService
    };
    const req = {
      headers: { authorization: "Bearer token" },
      body: {
        name: match.name,
        numberOfPlayers: match.numberOfPlayers
      }
    } as unknown as Request;
    const res = { json: jest.fn() } as unknown as Response;
    const next = {} as unknown as NextFunction;

    // Act
    await postMatch(req, res, next, services);

    // Assert
    expect(res.json).toHaveBeenCalledWith(match);
    expect(services.matchService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: match.name,
        numberOfPlayers: match.numberOfPlayers
      })
    );
  });

  it("GET /match/:matchId", async () => {
    // Setup
    const player = { id: 1, name: "Arthur Dent", active: true };

    const services: Services = {
      matchService: {
        findById: jest.fn().mockResolvedValue(match)
      } as unknown as MatchService,
      playerService: {} as unknown as PlayerService,
      playerScoreService: {} as unknown as PlayerScoreService,
      matchPlayerTeamService: {
        findPlayersByTeamId: jest.fn().mockResolvedValue([player])
      } as unknown as MatchPlayerTeamService,
      teamService: {} as unknown as TeamService
    };
    const req = {
      headers: { authorization: "Bearer token" },
      params: { matchId: 1 }
    } as unknown as Request;
    const res = { json: jest.fn() } as unknown as Response;
    const next = {} as unknown as NextFunction;

    // Act
    await getMatch(req, res, next, services);

    // Assert
    expect(res.json).toHaveBeenCalledWith({
      ...match,
      teams: [
        { ...match.teams[0], players: [player] },
        { ...match.teams[1], players: [player] }
      ]
    });
    expect(services.matchService.findById).toHaveBeenCalledWith(1);
  });

  it("PUT /match/:matchId/add", async () => {
    // Setup
    function createScores(point: number) {
      return [
        {
          position: POSITIONS[0],
          point
        }
      ];
    }

    const players = [
      { id: 1, name: "Arthur Dent", active: true, scores: createScores(4) },
      { id: 2, name: "Ford Prefect", active: true, scores: createScores(3) },
      {
        id: 3,
        name: "Zaphod Beeblebrox",
        active: true,
        scores: createScores(2)
      },
      { id: 4, name: "Marvin", active: true, scores: createScores(5) },
      { id: 5, name: "Trillian", active: true, scores: createScores(9) },
      { id: 6, name: "Slartibartfast", active: true, scores: createScores(1) }
    ];
    const services: Services = {
      matchService: {
        findById: jest.fn().mockResolvedValue(match),
        update: jest.fn().mockResolvedValue(match)
      } as unknown as MatchService,
      playerService: {
        findByIds: jest.fn().mockResolvedValue(players)
      } as unknown as PlayerService,
      playerScoreService: {} as unknown as PlayerScoreService,
      matchPlayerTeamService: {
        create: jest.fn().mockResolvedValue({})
      } as unknown as MatchPlayerTeamService,
      teamService: {} as unknown as TeamService
    };
    const req = {
      headers: { authorization: "Bearer token" },
      params: { matchId: 1 },
      body: {
        playerIds: [1, 2, 3, 4, 5, 6]
      }
    } as unknown as Request;
    const res = { json: jest.fn() } as unknown as Response;
    const next = {} as unknown as NextFunction;

    // Act
    await putMatchAdd(req, res, next, services);

    // Assert
    expect(res.json).toHaveBeenCalledWith({
      ...match,
      teams: [
        {
          id: 1,
          name: "Team A",
          players: [
            {
              active: true,
              id: 5,
              name: "Trillian",
              scores: [
                {
                  point: 9,
                  position: "GOALKEEPER"
                }
              ]
            },
            {
              active: true,
              id: 2,
              name: "Ford Prefect",
              scores: [
                {
                  point: 3,
                  position: "GOALKEEPER"
                }
              ]
            },
            {
              active: true,
              id: 6,
              name: "Slartibartfast",
              scores: [
                {
                  point: 1,
                  position: "GOALKEEPER"
                }
              ]
            }
          ],
          point: 0,
          type: "TeamA"
        },
        {
          id: 1,
          name: "Team B",
          players: [
            {
              active: true,
              id: 4,
              name: "Marvin",
              scores: [
                {
                  point: 5,
                  position: "GOALKEEPER"
                }
              ]
            },
            {
              active: true,
              id: 1,
              name: "Arthur Dent",
              scores: [
                {
                  point: 4,
                  position: "GOALKEEPER"
                }
              ]
            },
            {
              active: true,
              id: 3,
              name: "Zaphod Beeblebrox",
              scores: [
                {
                  point: 2,
                  position: "GOALKEEPER"
                }
              ]
            }
          ],
          point: 0,
          type: "TeamB"
        }
      ]
    });
  });
});
