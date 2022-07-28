import { RoomBuilder } from "../domain/t3";
import type { Registry } from "../registry";

import type { SocketIOServer } from "./types";

export const setupT3Websocket = (io: SocketIOServer, registry: Registry) => {
  const roomRepository = registry.t3RoomRepository;
  const roomBuilderRepository = registry.t3RoomBuilderRepository;

  io.on("connection", (socket) => {
    console.log("t3 socket connected");

    socket.on("createRoom", async () => {
      const roomBuilder = new RoomBuilder();
      await roomBuilderRepository.save(roomBuilder);

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

      const roomBuilder = await roomBuilderRepository.get(roomId);
      if (roomBuilder == null) return;

      await socket.join(roomId);
      roomBuilder.addPlayer(playerId);
      await roomBuilderRepository.save(roomBuilder);

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
};
