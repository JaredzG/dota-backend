import Fastify from "fastify";

const ENVIRONMENT = process.env.NODE_ENV ?? "development";
const HOST = process.env.SERVER_HOST ?? "0.0.0.0";
const PORT = parseInt(process.env.SERVER_PORT ?? "8004");

let logOption;
switch (ENVIRONMENT) {
  case "development":
    logOption = {
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      },
    };
    break;
  case "production":
    logOption = true;
    break;
  case "test":
    logOption = false;
}
const fastify = Fastify({
  logger: logOption ?? true, // defaults to true if no entry matches in the map
});

fastify.get("/", async (request, reply) => {
  return { hello: "world" };
  // return { msg: "xd" };
});

/**
 * Run the server!
 */
const start = async (): Promise<void> => {
  try {
    await fastify.listen({ host: HOST, port: PORT });
    console.log(`Server listening on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
await start();
