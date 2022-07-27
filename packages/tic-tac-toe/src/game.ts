const range = (from: number, to: number): number[] => {
  return Array(to - from + 1)
    .fill(null)
    .map((_, i) => i + from);
};

export type Player = {
  id: string;
};

type Coord = {
  y: number;
  x: number;
};

type Line = {
  origin: Coord;
  dx: number;
  dy: number;
};

type GameResult =
  | {
      type: "win";
      winnerId: string;
      line: Line;
    }
  | { type: "draw" };

export type Cell = string | null;

export type GameObject = Pick<
  Game,
  "players" | "turnPlayerIndex" | "cells" | "gameResult"
>;
export class Game {
  constructor(
    public players: Player[] = [{ id: "A" }, { id: "B" }],
    public turnPlayerIndex: number = 0,
    public cells: Cell[][] = range(1, 3).map(() => [null, null, null]),
    public gameResult: GameResult | null = null
  ) {}

  static fromObject(object: GameObject): Game {
    return new Game(
      object.players,
      object.turnPlayerIndex,
      object.cells,
      object.gameResult
    );
  }

  toObject(): GameObject {
    return {
      players: this.players,
      turnPlayerIndex: this.turnPlayerIndex,
      cells: this.cells,
      gameResult: this.gameResult,
    };
  }

  canPut(y: number, x: number): boolean {
    return this.cells[y][x] == null;
  }

  put(y: number, x: number): Game {
    if (this.gameResult) return this;
    if (!this.canPut(y, x)) return this;

    this.cells[y][x] = this.players[this.turnPlayerIndex].id;
    this.gameResult = this.calculateGameResult();
    if (this.gameResult == null) {
      this.turnPlayerIndex = 1 - this.turnPlayerIndex;
    }

    return Game.fromObject(this.toObject());
  }

  private calculateGameResult(): GameResult | null {
    for (const player of this.players) {
      const playerId = player.id;
      const lines = [
        { origin: { y: 0, x: 0 }, dx: 0, dy: 1 },
        { origin: { y: 0, x: 1 }, dx: 0, dy: 1 },
        { origin: { y: 0, x: 2 }, dx: 0, dy: 1 },
        { origin: { y: 0, x: 0 }, dx: 1, dy: 0 },
        { origin: { y: 1, x: 0 }, dx: 1, dy: 0 },
        { origin: { y: 2, x: 0 }, dx: 1, dy: 0 },
        { origin: { y: 0, x: 0 }, dx: 1, dy: 1 },
        { origin: { y: 0, x: 2 }, dx: -1, dy: 1 },
      ];

      for (const line of lines) {
        const cells = range(0, 2).map((i) => {
          const y = line.origin.y + line.dy * i;
          const x = line.origin.x + line.dx * i;
          return this.cells[y][x];
        });

        if (cells.every((cell) => cell === playerId)) {
          return { type: "win", winnerId: playerId, line };
        }
      }
    }

    const filled = range(0, 2)
      .flatMap((y) => range(0, 2).map((x) => this.cells[y][x]))
      .every((cell) => cell != null);
    if (filled) {
      return { type: "draw" };
    }

    return null;
  }
}
