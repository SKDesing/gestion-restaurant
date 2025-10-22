import { startSocketServer } from "../src/server/index";

const port = Number(process.env.SOCKET_PORT || 4001);

startSocketServer(port);

// Keep the process alive
process.on("SIGINT", async () => {
  console.log("Shutting down socket dev server");
  process.exit(0);
});
