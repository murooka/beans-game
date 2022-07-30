/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { describe, it, expect } from "vitest";

import { Game } from "./game";

describe("ゲームの終了条件", () => {
  it("一列揃うと勝ち", async () => {
    const game = new Game();
    expect(game.gameResult).null;

    game.put(0, 0);
    game.put(0, 1);
    game.put(1, 0);
    game.put(0, 2);
    expect(game.gameResult).null;
    game.put(2, 0);
    /*
     O | X | X
    ---+---+---
     O |   |
    ---+---+---
     O |   |
    */
    const result = game.gameResult;
    expect(result).not.null;
    if (result == null) return;

    expect(result.type).toBe("win");
    if (result.type !== "win") return;

    expect(result.winnerId).toBe("A");
  });
  it("列が揃わずに埋まると引き分け", () => {
    const game = new Game();
    game.put(1, 1);
    game.put(0, 0);
    game.put(1, 0);
    game.put(1, 2);
    game.put(2, 0);
    game.put(0, 2);
    game.put(0, 1);
    game.put(2, 1);
    game.put(2, 2);
    /*
     X | O | X
    ---+---+---
     O | O | X
    ---+---+---
     O | X |
    */
    const result = game.gameResult;
    expect(result).not.null;
    expect(result!.type).toBe("draw");
  });
});
