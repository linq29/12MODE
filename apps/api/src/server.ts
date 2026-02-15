import cors from "cors";
import express from "express";
import { env } from "./config/env";
import healthRouter from "./routes/health";
import shrinesRouter from "./routes/shrines";

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

app.use("/api", healthRouter);
app.use("/api", shrinesRouter);

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const message = error instanceof Error ? error.message : "Internal server error";
  res.status(500).json({ error: message });
});

app.listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}`);
});
