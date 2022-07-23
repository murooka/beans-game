const range = (from: number, to: number): number[] => {
  return Array(to - from + 1)
    .fill(null)
    .map((_, i) => i + from);
};

export class Player {
  constructor(public readonly id: string) {}
}

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
      winnerId: number;
      line: Line;
    }
  | { type: "draw" };

export type Cell = number | null;

type GameObject = {
  turnPlayerId: number;
  cells: Cell[][];
  gameResult: GameResult | null;
};
export class Game {
  constructor(
    public turnPlayerId: number = 1,
    public cells: Cell[][] = range(1, 3).map(() => [null, null, null]),
    public gameResult: GameResult | null = null
  ) {}

  static playerIds = [1, 2];

  static fromObject(object: GameObject): Game {
    return new Game(object.turnPlayerId, object.cells, object.gameResult);
  }

  toObject(): GameObject {
    return {
      turnPlayerId: this.turnPlayerId,
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

    this.cells[y][x] = this.turnPlayerId;
    this.gameResult = this.calculateGameResult();
    if (this.gameResult == null) {
      this.turnPlayerId = 3 - this.turnPlayerId;
    }

    return Game.fromObject(this.toObject());
  }

  private calculateGameResult(): GameResult | null {
    for (const playerId of Game.playerIds) {
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
