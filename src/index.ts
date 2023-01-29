import express from "express";
import { dataSource } from "./db/datasources";
import { matchRouter, playerRouter, scoreRouter } from "./routes";

const port = 3000;

const app = express();

app.use(express.json());
app.use("/", matchRouter);
app.use("/", playerRouter);
app.use("/", scoreRouter);

dataSource.initialize().then(async () => {
  app.listen(port, () => {
    console.log(`Server running on ${port}`);
  });
});

export default app;
