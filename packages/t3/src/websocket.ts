import type { GameObject } from "./game";

export type ServerToClientEvents = {
  "t3/room-created": (roomId: string) => void;
  "t3/game-started": (roomId: string, game: GameObject) => void;
  "t3/game-changed": (roomId: string, game: GameObject) => void;
};

export type ClientToServerEvents = {
  "t3/create-room": () => void;
  "t3/join-room": (roomId: string, playerId: string) => void;
  "t3/put": (roomId: string, y: number, x: number) => void;
};

export type InterServerEvents = { _dummy: () => void };
