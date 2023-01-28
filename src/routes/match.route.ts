import { Router } from "express";
import { Match } from "../entity";
import {
  MatchService,
  PlayerService,
  MatchPlayerTeamService
} from "../services";
import {
  assignPlayersToPosition,
  createSortedKeyValuePairs,
  splitArray
} from "../utils/array";

import use from "../utils/use";

const router = Router();

/**
 * List all Match entites
 * @todo: pagination would be nice
 */
router.get(
  "/match",
  use(async (req, res) => {
    const matchService = new MatchService();
    const matches = await matchService.findAll();
    res.json(matches);
  })
);

/**
 * Create a match entiy and the teams entities for the match
 */
router.post(
  "/match",
  use(async (req, res) => {
    // Input validation: this should be done by Swagger or GraphQL
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

    // Create the match
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

/**
 * Fetch a match by id, plus fetch the teams for the match and the players for each match
 */
router.get(
  "/match/:matchId",
  use(async (req, res) => {
    const matchId = Number(req.params.matchId);

    if (isNaN(matchId)) {
      throw new Error("Invalid matchId");
    }

    const matchPlayerTeamService = new MatchPlayerTeamService();
    const matchService = new MatchService();

    const match = await matchService.findById(matchId);
    if (match) {
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      const teams: any[] = [];
      if (match.teams) {
        await Promise.all(
          match.teams.map(async (team) => {
            const players = await matchPlayerTeamService.findPlayersByTeamId(
              team.id as number
            );
            teams.push({
              ...team,
              players
            });
          })
        );
      }

      res.json({ ...match, teams });
    } else {
      res.sendStatus(404);
    }
  })
);

/**
 * Add users to a match. The match mast not be finalised and the players must be active
 * Align players into teams.
 */
router.put(
  "/match/:matchId/add",
  use(async (req, res) => {
    const matchPlayerTeamService = new MatchPlayerTeamService();
    const matchService = new MatchService();
    const playerService = new PlayerService();

    const matchId = Number(req.params.matchId);
    const playerIds = req.body.playerIds;

    if (isNaN(matchId)) {
      throw new Error("Invalid matchId");
    }
    const match = await matchService.findById(matchId);
    if (!match || !match.teams) {
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

    // Identify the two teams
    const teamA = match.teams.find((t) => t.type === "TeamA");
    const teamB = match.teams.find((t) => t.type === "TeamB");
    if (!teamA || !teamB) {
      throw new Error("Invalid teams!");
    }

    // fetch the players
    const players = await playerService.findByIds(playerIds);
    if (players.length !== match.numberOfPlayers) {
      throw new Error("Invalid number of players!");
    }

    /**
     * create a key value pair of user ids and total number of poins like:
     * pairs [
     *   { key: 1, value: 14 },
     *   { key: 2, value: 10 },
     *   { key: 3, value: 6 },
     *   { key: 4, value: 0 }
     * ]
     */
    const pairs = createSortedKeyValuePairs(players);

    /**
     * Split the key-value pair into two arrays (for teamA and teamB) like:
     * [
     *   { key: 1, value: 14 },
     *   { key: 4, value: 0 }
     * ],
     * [
     *   { key: 2, value: 10 },
     *   { key: 3, value: 2 }
     * ]
     */
    const [teamAids, teamBids] = splitArray(pairs);

    /**
     * Create the MatchPlayersTeams records
     */
    const team1 = assignPlayersToPosition(teamAids, players, match, teamA);
    const team2 = assignPlayersToPosition(teamBids, players, match, teamB);

    /**
     * Write them to the database
     */
    await Promise.all(
      [...team1, ...team2].map((e) => matchPlayerTeamService.create(e))
    );

    /**
     * Set the finalized flag to true and remove the teams. We don't need to
     * save them too.
     */
    match.finalized = true;
    delete match.teams;
    await matchService.update(match.id as number, match);

    /**
     * Show result
     */
    res.json({
      ...match,
      teams: [
        {
          ...teamA,
          players: team1.map((t) => t.player)
        },
        {
          ...teamB,
          players: team2.map((t) => t.player)
        }
      ]
    });
  })
);

export default router;
