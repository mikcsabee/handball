import express from "express";

import {
  MatchPlayerTeamService,
  MatchService,
  PlayerScoreService,
  PlayerService,
  TeamService
} from "../services";

export interface Services {
  matchService: MatchService;
  matchPlayerTeamService: MatchPlayerTeamService;
  playerService: PlayerService;
  playerScoreService: PlayerScoreService;
  teamService: TeamService;
}

interface MyHandler {
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
    services: Services
  ): void;
}

export default (fn: MyHandler) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.headers["authorization"] === "Bearer token") {
      const services = {
        matchService: new MatchService(),
        matchPlayerTeamService: new MatchPlayerTeamService(),
        playerService: new PlayerService(),
        playerScoreService: new PlayerScoreService(),
        teamService: new TeamService()
      };

      Promise.resolve(fn(req, res, next, services)).catch(next);
    } else {
      res.sendStatus(403);
    }
  };
