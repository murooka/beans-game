import * as http from "http";

import express from "express";
import { Server } from "socket.io";

import { config } from "./config";
import { createRegistry } from "./registry";
import { setupT3Websocket } from "./websocket/t3";
import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./websocket/types";

function main() {
  const port = parseInt(process.env.PORT || "4000");

  const app = express();

  const server = http.createServer(app);
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(server, {
    cors: {
      origin: config.WEB_ORIGIN,
      methods: ["GET", "POST"],
    },
  });

  const registry = createRegistry();

  setupT3Websocket(io, registry);

  server.listen(port, () => {
    console.log("listening on localhost:" + port);
  });
}

main();
