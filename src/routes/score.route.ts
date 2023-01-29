import { Router, Request, Response, NextFunction } from "express";
import use, { Services } from "../utils/use";

/**
 * Add score to a player and to a team for a match
 * The player must be in a team of that match
 */
export async function putScore(
  req: Request,
  res: Response,
  next: NextFunction,
  services: Services
): Promise<void> {
  const matchId = req.body.matchId;
  const playerId = req.body.playerId;
  const point = req.body.point;

  // Input validations and data selects. Most of it should be done by Swagger or GraphQL
  if (isNaN(point) || point <= 0) {
    throw new Error("Invalid point!");
  }

  const match = await services.matchService.findById(matchId);
  if (!match) {
    throw new Error("Invalid match id!");
  }

  const player = await services.playerService.findById(playerId);
  if (!player) {
    throw new Error("Invalid player id!");
  }

  const matchPlayerTeam =
    await services.matchPlayerTeamService.findByMatchIdAndPlayerId(
      matchId,
      playerId
    );

  if (!matchPlayerTeam) {
    throw new Error("Player is not playing in that match!");
  }

  const team = await services.teamService.findById(matchPlayerTeam.teamId);
  if (!team || !team.id) {
    throw new Error("Invalid team!");
  }

  /**
   * Find the score for a player and position and add the point to it, or create it
   */
  const playerScore = await services.playerScoreService.scorePlayer(
    player,
    matchPlayerTeam.position,
    point
  );

  /**
   * Update the team point
   */
  team.point += point;
  await services.teamService.update(team.id, team);

  res.json(playerScore);
}

const router = Router();

router.put("/score", use(putScore));

export default router;
