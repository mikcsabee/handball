import { Router } from "express";
import { Match, MatchPlayerTeam } from "../entity";
import {
  MatchService,
  PlayerService,
  MatchPlayerTeamService,
  TeamService
} from "../services";
import {
  assignPlayersToPosition,
  createSortedKeyValuePairs,
  splitArray
} from "../utils/array";

import use from "../utils/use";

const router = Router();

router.get(
  "/match",
  use(async (req, res) => {
    const service = new MatchService();
    const matches = await service.findAll();
    res.json(matches);
  })
);

router.post(
  "/match",
  use(async (req, res) => {
    if (typeof req.body.name !== "string" || req.body.name.length < 3) {
      throw new Error("Invalid input: name");
    }
    const numberOfPlayers = req.body.numberOfPlayers;
    if (
      isNaN(numberOfPlayers) ||
      numberOfPlayers < Match.MIN_NUMBER_OF_PLAYERS ||
      numberOfPlayers > Match.MAX_NUMBER_OF_PLAYERS
    ) {
      throw new Error("Invalid input: numberOfPlayers");
    }

    const matchService = new MatchService();
    const match = await matchService.create({
      name: req.body.name,
      numberOfPlayers,
      createdAt: Date.now(),
      finalized: false
    });
    res.json(match);
  })
);

router.get(
  "/match/:matchId",
  use(async (req, res) => {
    const matchId = Number(req.params.matchId);

    if (isNaN(matchId)) {
      throw new Error("Invalid matchId");
    }

    const matchPlayerTeamService = new MatchPlayerTeamService();
    const matchService = new MatchService();
    const playerService = new PlayerService();
    const teamsService = new TeamService();

    const match = await matchService.findById(matchId);
    if (match) {
      const teams = await teamsService.findByMatchId(match.id as number);
      const teamA = teams.find((t) => t.type === "TeamA");
      const teamB = teams.find((t) => t.type === "TeamB");
      if (!teamA || !teamB) {
        throw new Error("Invalid teams!");
      }

      const matchPlayersTeams = await matchPlayerTeamService.findByMatchId(
        matchId
      );

      const playersAIds = matchPlayersTeams
        .filter((m) => m.teamId === teamA.id)
        .map((p) => p.playerId);
      const playersBIds = matchPlayersTeams
        .filter((m) => m.teamId === teamB.id)
        .map((p) => p.playerId);
      const playersA = await playerService.findByIds(playersAIds);
      const playersB = await playerService.findByIds(playersBIds);

      res.json({
        ...match,
        teams: [
          { ...teamA, players: playersA },
          { ...teamB, players: playersB }
        ]
      });
    } else {
      res.sendStatus(404);
    }
  })
);

router.put(
  "/match/:matchId/add",
  use(async (req, res) => {
    const matchPlayerTeamService = new MatchPlayerTeamService();
    const matchService = new MatchService();
    const playerService = new PlayerService();
    const teamsService = new TeamService();

    const matchId = Number(req.params.matchId);
    const playerIds = req.body.playerIds;

    if (isNaN(matchId)) {
      throw new Error("Invalid matchId");
    }
    const match = await matchService.findById(matchId);
    if (!match) {
      throw new Error("Match doesn't exists!");
    }
    if (match.finalized) {
      throw new Error("Match is already finalized!");
    }
    if (
      !Array.isArray(playerIds) ||
      playerIds.length != match.numberOfPlayers
    ) {
      throw new Error("Invalid list of playerIds!");
    }
    const teams = await teamsService.findByMatchId(match.id as number);
    const teamA = teams.find((t) => t.type === "TeamA");
    const teamB = teams.find((t) => t.type === "TeamB");
    if (!teamA || !teamB) {
      throw new Error("Invalid teams!");
    }

    const players = await playerService.findByIds(playerIds);

    const pairs = createSortedKeyValuePairs(players);

    const [teamAids, teamBids] = splitArray(pairs);

    const team1 = assignPlayersToPosition(teamAids, players, match, teamA);
    const team2 = assignPlayersToPosition(teamBids, players, match, teamB);

    const matchPlayersTeams: MatchPlayerTeam[] = [...team1, ...team2];

    await Promise.all(
      matchPlayersTeams.map((e) => matchPlayerTeamService.create(e))
    );

    match.finalized = true;
    await matchService.update(match.id as number, match);

    const playersInTeamA = team1.map((t) => t.player);
    const playersInTeamB = team2.map((t) => t.player);

    res.json({
      ...match,
      teams: [
        {
          ...teamA,
          players: playersInTeamA
        },
        {
          ...teamB,
          players: playersInTeamB
        }
      ]
    });
  })
);

export default router;
