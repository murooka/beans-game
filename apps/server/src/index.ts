import * as http from "http";

import express from "express";
import { Server } from "socket.io";
import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
} from "tic-tac-toe";

import { RoomRepository, RoomBuilderRepository, RoomBuilder } from "./t3";

type SocketData = {
  playerId?: string | undefined;
};

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
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  const builderRepository = new RoomBuilderRepository();
  const roomRepository = new RoomRepository();

  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  });

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("createRoom", async () => {
      const roomBuilder = new RoomBuilder();
      await builderRepository.save(roomBuilder);

      socket.emit("roomCreated", roomBuilder.roomId);
    });

    socket.on("joinRoom", async (roomId, playerId) => {
      console.log(`joinRoom: ` + JSON.stringify({ roomId, playerId }));

      socket.data.playerId = playerId;

      const room = await roomRepository.get(roomId);
      if (room) {
        if (!room.game.players.map((_) => _.id).includes(playerId)) return;

        await socket.join(roomId);
        socket.emit("gameChanged", roomId, room.game.toObject());
        return;
      }

      const roomBuilder = await builderRepository.get(roomId);
      if (roomBuilder == null) return;

      await socket.join(roomId);
      roomBuilder.addPlayer(playerId);
      await builderRepository.save(roomBuilder);

      if (roomBuilder.isReady) {
        const room = roomBuilder.build();
        await roomRepository.save(room);
        io.in(roomId).emit("gameStarted", roomId, room.game.toObject());
      }
    });

    socket.on("put", async (roomId, y, x) => {
      console.log(JSON.stringify({ roomId, y, x }));

      const { playerId } = socket.data;
      if (playerId == null) return;

      const room = await roomRepository.get(roomId);
      if (room == null) return;
      if (playerId !== room.game.turnPlayerId) return;

      room.game.put(y, x);
      await roomRepository.save(room);

      io.in(roomId).emit("gameChanged", roomId, room.game.toObject());
    });
  });

  server.listen(port, () => {
    console.log("listening on localhost:" + port);
  });
}

main();
