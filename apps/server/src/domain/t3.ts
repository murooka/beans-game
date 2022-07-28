import { randomBytes } from "crypto";

import type { Player } from "t3";
import { Game } from "t3";

export class RoomBuilder {
  constructor(
    public readonly roomId: string = randomBytes(4).toString("hex"),
    public readonly players: Player[] = []
  ) {
    this.players = [];
  }

  get isReady(): boolean {
    return this.players.length === 2;
  }

  addPlayer(id: string): void {
    if (this.players.map((_) => _.id).includes(id)) return;
    if (this.players.length >= 2) throw new Error("room is full");
    this.players.push({ id });
  }

  build(): Room {
    return new Room(this.roomId, new Game(this.players));
  }
}

export class RoomBuilderRepository {
  map = new Map<string, RoomBuilder>();

  async save(builder: RoomBuilder): Promise<RoomBuilder> {
    this.map.set(builder.roomId, builder);
    return builder;
  }
  async get(id: string): Promise<RoomBuilder | null> {
    return this.map.get(id) ?? null;
  }
}

export class Room {
  constructor(public readonly id: string, public readonly game: Game) {}
}

export class RoomRepository {
  map = new Map<string, Room>();

  async save(room: Room): Promise<Room> {
    this.map.set(room.id, room);
    return room;
  }
  async get(id: string): Promise<Room | null> {
    return this.map.get(id) ?? null;
  }
}
