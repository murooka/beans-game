import type { GameObject } from "./game";

export type ServerToClientEvents = {
  roomCreated: (roomId: string) => void;
  gameStarted: (roomId: string, game: GameObject) => void;
  gameChanged: (roomId: string, game: GameObject) => void;
};

export type ClientToServerEvents = {
  createRoom: () => void;
  joinRoom: (roomId: string, playerId: string) => void;
  put: (roomId: string, y: number, x: number) => void;
};

export type InterServerEvents = {};
