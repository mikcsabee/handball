import { Request, Response, Router, NextFunction } from "express";
import { Match } from "../entity";
import { assignPlayersToTeams } from "../utils/array";
import use, { Services } from "../utils/use";

/**
 * List all Match entites
 * @todo: pagination would be nice
 */
export async function getMatches(
  req: Request,
  res: Response,
  next: NextFunction,
  services: Services
): Promise<void> {
  const matches = await services.matchService.findAll();
  res.json(matches);
}

/**
 * Create a match entiy and the teams entities for the match
 */
export async function postMatch(
  req: Request,
  res: Response,
  next: NextFunction,
  services: Services
): Promise<void> {
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
  const match = await services.matchService.create({
    name: req.body.name,
    numberOfPlayers,
    createdAt: Date.now(),
    finalized: false
  });
  res.json(match);
}

/**
 * Fetch a match by id, plus fetch the teams for the match and the players for each match
 */
export async function getMatch(
  req: Request,
  res: Response,
  next: NextFunction,
  services: Services
): Promise<void> {
  const matchId = Number(req.params.matchId);

  if (isNaN(matchId)) {
    throw new Error("Invalid matchId");
  }

  const match = await services.matchService.findById(matchId);
  if (match) {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const teams: any[] = [];
    if (match.teams) {
      await Promise.all(
        match.teams.map(async (team) => {
          const players =
            await services.matchPlayerTeamService.findPlayersByTeamId(
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
}

/**
 * Add users to a match. The match mast not be finalised and the players must be active
 * Align players into teams.
 */
export async function putMatchAdd(
  req: Request,
  res: Response,
  next: NextFunction,
  services: Services
): Promise<void> {
  const matchId = Number(req.params.matchId);
  const playerIds = req.body.playerIds;

  if (isNaN(matchId)) {
    throw new Error("Invalid matchId");
  }
  const match = await services.matchService.findById(matchId);
  if (!match || !match.teams) {
    throw new Error("Match doesn't exists!");
  }
  if (match.finalized) {
    throw new Error("Match is already finalized!");
  }
  if (!Array.isArray(playerIds) || playerIds.length != match.numberOfPlayers) {
    throw new Error("Invalid list of playerIds!");
  }

  // Identify the two teams
  const teamA = match.teams.find((t) => t.type === "TeamA");
  const teamB = match.teams.find((t) => t.type === "TeamB");
  if (!teamA || !teamB) {
    throw new Error("Invalid teams!");
  }

  // fetch the players
  const players = await services.playerService.findByIds(playerIds);
  if (players.length !== match.numberOfPlayers) {
    throw new Error("Invalid number of players!");
  }

  // Assign the players into teams
  const { team1, team2 } = assignPlayersToTeams(players, match, teamA, teamB);

  /**
   * Write them to the database
   */
  await Promise.all(
    [...team1, ...team2].map((e) => services.matchPlayerTeamService.create(e))
  );

  /**
   * Set the finalized flag to true and remove the teams. We don't need to
   * save them too.
   */
  match.finalized = true;
  delete match.teams;
  await services.matchService.update(match.id as number, match);

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
}

const router = Router();

router.get("/match", use(getMatches));
router.post("/match", use(postMatch));
router.get("/match/:matchId", use(getMatch));
router.put("/match/:matchId/add", use(putMatchAdd));

export default router;
