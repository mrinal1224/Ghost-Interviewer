import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";

const app = Fastify({
  logger: true,
});

await app.register(helmet);
await app.register(cors, {
  origin: true,
  credentials: true,
});

app.get("/health", async () => ({
  status: "ok",
  service: "ghost-api",
  timestamp: new Date().toISOString(),
}));

const port = Number(process.env.PORT ?? 4000);
const host = process.env.HOST ?? "0.0.0.0";

try {
  await app.listen({ port, host });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
