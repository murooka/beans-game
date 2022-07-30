/* eslint-disable @typescript-eslint/no-explicit-any */
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

type ValueOf<T> = T[keyof T];
type Event = ValueOf<{
  [K in keyof ServerToClientEvents]: [
    K,
    ...Parameters<ServerToClientEvents[K]>
  ];
}>;

class EventBox {
  events: Event[];
  constructor(
    socket: ClientSocket<ServerToClientEvents, ClientToServerEvents>
  ) {
    this.events = [];
    const names = [
      "t3/room-created",
      "t3/game-started",
      "t3/game-changed",
    ] as const;
    for (const name of names) {
      socket.on(name, (...args: unknown[]) =>
        this.events.push([name, ...args] as any)
      );
    }
  }
  async receive(): Promise<Event> {
    return new Promise((resolve) => {
      const timerId = setInterval(() => {
        if (this.events.length > 0) {
          const item = this.events.shift();
          if (item) {
            clearInterval(timerId);
            resolve(item);
          }
        }
      }, 10);
    });
  }
}

describe("t3", () => {
  let io: Server,
    clientSocket1: ClientSocket<ServerToClientEvents, ClientToServerEvents>,
    clientSocket2: ClientSocket<ServerToClientEvents, ClientToServerEvents>;

  let eventBox1: EventBox, eventBox2: EventBox;

  beforeAll(async () => {
    const registry = createRegistry();
    const httpServer = createServer();
    io = new Server(httpServer);
    setupT3Websocket(io, registry);

    await new Promise<void>((resolve) => httpServer.listen(resolve));

    const port = (httpServer.address() as AddressInfo).port;
    clientSocket1 = clientIO(`http://localhost:${port}`);
    clientSocket2 = clientIO(`http://localhost:${port}`);

    eventBox1 = new EventBox(clientSocket1);
    eventBox2 = new EventBox(clientSocket2);

    await Promise.all([
      new Promise<void>((resolve) => clientSocket1.on("connect", resolve)),
      new Promise<void>((resolve) => clientSocket2.on("connect", resolve)),
    ]);
  });

  afterAll(() => {
    io.close();
    clientSocket1.close();
    clientSocket2.close();
  });

  it("部屋を作成してゲームが始まる", async () => {
    clientSocket1.emit("t3/create-room");

    const event1 = await eventBox1.receive();
    expect(event1[0]).toBe("t3/room-created");
    const roomId = event1[1];

    expect(roomId).lengthOf.above(1);

    clientSocket1.emit("t3/join-room", roomId, "A");
    clientSocket2.emit("t3/join-room", roomId, "B");

    const event2 = await eventBox1.receive();
    expect(event2[0]).toBe("t3/game-started");

    const event3 = await eventBox2.receive();
    expect(event3[0]).toBe("t3/game-started");
  });
});
