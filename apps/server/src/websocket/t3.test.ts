/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createServer } from "http";
import type { AddressInfo } from "net";

import { Server } from "socket.io";
import type { Socket as ClientSocket } from "socket.io-client";
import { io as clientIO } from "socket.io-client";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createRegistry } from "../registry";

import { setupT3Websocket } from "./t3";
import type { ClientToServerEvents, ServerToClientEvents } from "./types";

describe("t3", () => {
  let io: Server,
    clientSocket1: ClientSocket<ServerToClientEvents, ClientToServerEvents>,
    clientSocket2: ClientSocket<ServerToClientEvents, ClientToServerEvents>;

  beforeAll(() => {
    const registry = createRegistry();
    return new Promise<void>((resolve) => {
      const httpServer = createServer();
      io = new Server(httpServer);
      setupT3Websocket(io, registry);
      httpServer.listen(() => {
        const port = (httpServer.address() as AddressInfo).port;
        clientSocket1 = clientIO(`http://localhost:${port}`);
        clientSocket2 = clientIO(`http://localhost:${port}`);

        Promise.all([
          new Promise<void>((resolve) => clientSocket1.on("connect", resolve)),
          new Promise<void>((resolve) => clientSocket2.on("connect", resolve)),
        ]).then(() => resolve());
      });
    });
  });

  afterAll(() => {
    io.close();
    clientSocket1.close();
    clientSocket2.close();
  });

  it("部屋を作成してゲームが始まる", async () => {
    let roomId: string | null = null;

    await new Promise<void>((resolve) => {
      clientSocket1.on("t3/room-created", (_roomId) => {
        roomId = _roomId;
        resolve();
      });
      clientSocket1.emit("t3/create-room");
    });

    expect(roomId).lengthOf.above(1);

    await new Promise<void>((resolve) => {
      Promise.all([
        new Promise<void>((resolve) => {
          clientSocket1.on("t3/game-started", (roomId, object) => {
            resolve();
          });
        }),
        new Promise<void>((resolve) => {
          clientSocket2.on("t3/game-started", (roomId, object) => {
            resolve();
          });
        }),
      ]).then(() => resolve());

      clientSocket1.emit("t3/join-room", roomId!, "A");
      clientSocket2.emit("t3/join-room", roomId!, "B");
    });
  });
});
