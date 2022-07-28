import type { Server } from "socket.io";
import type T3 from "t3";

export type SocketData = {
  playerId?: string | undefined;
};
export type ClientToServerEvents = T3.ClientToServerEvents;
export type ServerToClientEvents = T3.ServerToClientEvents;
export type InterServerEvents = T3.InterServerEvents;

export type SocketIOServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
