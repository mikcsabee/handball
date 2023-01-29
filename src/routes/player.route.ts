import { Request, Response, Router, NextFunction } from "express";
import use, { Services } from "../utils/use";

/**
 * List all Player entites
 * @todo: pagination would be nice
 */
export async function getPlayers(
  req: Request,
  res: Response,
  next: NextFunction,
  services: Services
): Promise<void> {
  const players = await services.playerService.findAll();
  res.json(players);
}

/**
 * Create a player entiy
 */
export async function postPlayer(
  req: Request,
  res: Response,
  next: NextFunction,
  services: Services
): Promise<void> {
  if (typeof req.body.name !== "string" || req.body.name.length < 3) {
    throw new Error("Invalid input: name");
  }

  const player = await services.playerService.create({
    name: req.body.name,
    active: true
  });

  res.json(player);
}

/**
 * Fetch a player by id, plus fetch the scores
 */
export async function getPlayer(
  req: Request,
  res: Response,
  next: NextFunction,
  services: Services
): Promise<void> {
  const id = Number(req.params.id);
  const player = await services.playerService.findById(id);

  res.json(player);
}

/**
 * Update a player.
 * Name or the active field can be updated
 */
export async function putPlayer(
  req: Request,
  res: Response,
  next: NextFunction,
  services: Services
): Promise<void> {
  const id = Number(req.params.id);
  const player = await services.playerService.findById(id);
  if (!player) {
    throw new Error(`Invalid input: player id: ${req.params.id}`);
  }

  if (typeof req.body.name === "string" && req.body.name.length >= 3) {
    player.name = req.body.name;
  }
  if (typeof req.body.active === "boolean") {
    player.active = req.body.active;
  }

  await services.playerService.update(id as number, player);

  res.json(player);
}

const router = Router();

router.get("/player", use(getPlayers));
router.post("/player", use(postPlayer));
router.get("/player/:id", use(getPlayer));
router.put("/player/:id", use(putPlayer));

export default router;
