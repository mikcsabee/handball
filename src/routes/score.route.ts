import { Router } from "express";
import {
  MatchPlayerTeamService,
  MatchService,
  PlayerScoreService,
  PlayerService,
  TeamService
} from "../services";
import use from "../utils/use";

const router = Router();

/**
 * Add score to a player and to a team for a match
 * The player must be in a team of that match
 */
router.put(
  "/score",
  use(async (req, res) => {
    const matchId = req.body.matchId;
    const playerId = req.body.playerId;
    const point = req.body.point;

    const matchService = new MatchService();
    const playerService = new PlayerService();
    const playerScoreService = new PlayerScoreService();
    const matchPlayerTeamService = new MatchPlayerTeamService();
    const teamService = new TeamService();

    // Input validations and data selects. Most of it should be done by Swagger or GraphQL
    if (isNaN(point) || point <= 0) {
      throw new Error("Invalid point!");
    }

    const match = await matchService.findById(matchId);
    if (!match) {
      throw new Error("Invalid match id!");
    }

    const player = await playerService.findById(playerId);
    if (!player) {
      throw new Error("Invalid player id!");
    }

    const matchPlayerTeam =
      await matchPlayerTeamService.findByMatchIdAndPlayerId(matchId, playerId);

    if (!matchPlayerTeam) {
      throw new Error("Player is not playing in that match!");
    }

    const team = await teamService.findById(matchPlayerTeam.teamId);
    if (!team || !team.id) {
      throw new Error("Invalid team!");
    }

    /**
     * Find the score for a player and position and add the point to it, or create it
     */
    let playerScore = await playerScoreService.findByPlayerIdAndPosition(
      playerId,
      matchPlayerTeam.position
    );
    if (playerScore) {
      playerScore.point += point;
      await playerScoreService.update(playerScore.id as number, playerScore);
    } else {
      playerScore = await playerScoreService.create({
        position: matchPlayerTeam.position,
        point,
        playerId,
        player
      });
    }

    /**
     * Update the team point
     */
    team.point += point;
    await teamService.update(team.id, team);

    res.json(playerScore);
  })
);

export default router;
