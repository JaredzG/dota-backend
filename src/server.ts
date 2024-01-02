import Fastify from "fastify";

const {
  NODE_ENV: environment = "development",
  SERVER_HOST: host = "0.0.0.0",
  SERVER_PORT: port = "8004",
} = process.env;
let logOption;
switch (environment) {
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
  // return { msg: "lol" };
});

/**
 * Run the server!
 */
const start = async (): Promise<void> => {
  try {
    await fastify.listen({ host, port: parseInt(port) });
    console.log(`Server listening on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
await start();
