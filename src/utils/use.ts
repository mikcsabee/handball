import express from "express";

export default (fn: express.RequestHandler) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.headers["authorization"] === "Bearer token") {
      Promise.resolve(fn(req, res, next)).catch(next);
    } else {
      res.sendStatus(403);
    }
  };
