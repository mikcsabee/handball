import { Router } from "express";
import { PlayerScoreService, PlayerService } from "../services";
import use from "../utils/use";

const router = Router();

router.get(
  "/player",
  use(async (req, res) => {
    const service = new PlayerService();
    const players = await service.findAll();
    res.json(players);
  })
);
router.post(
  "/player",
  use(async (req, res) => {
    if (typeof req.body.name !== "string" || req.body.name.length < 3) {
      throw new Error("Invalid input: name");
    }

    const service = new PlayerService();

    const player = await service.create({
      name: req.body.name,
      active: true
    });

    res.json(player);
  })
);

router.get(
  "/player/:id",
  use(async (req, res) => {
    const playerService = new PlayerService();
    const playerScoreService = new PlayerScoreService();
    const id = Number(req.params.id);
    const player = await playerService.findById(id);
    const scores = await playerScoreService.findByPlayerId(id);

    res.json({ ...player, scores });
  })
);

router.put(
  "/player/:id",
  use(async (req, res) => {
    const service = new PlayerService();
    const id = Number(req.params.id);
    const player = await service.findById(id);
    if (!player) {
      throw new Error(`Invalid input: player id: ${req.params.id}`);
    }

    if (typeof req.body.name === "string" && req.body.name.length >= 3) {
      player.name = req.body.name;
    }
    if (typeof req.body.active === "boolean") {
      player.active = req.body.active;
    }

    await service.update(id as number, player);

    res.json(player);
  })
);

export default router;
