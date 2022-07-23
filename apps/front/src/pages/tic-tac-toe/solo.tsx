import { useEffect, useState } from "react";
import { Game } from "tic-tac-toe";

import { GameArea } from "../../components/GameArea";

const cpuLevel1 = (game: Game): { y: number; x: number } => {
  while (true) {
    const x = Math.floor(Math.random() * 3);
    const y = Math.floor(Math.random() * 3);
    if (game.canPut(y, x)) {
      return { y, x };
    }
  }
};

export default function TicTacToeSolo() {
  const [game, setGame] = useState(new Game());
  const isMyTurn = game.turnPlayerId === 1;
  useEffect(() => {
    if (game.gameResult) return;
    if (isMyTurn) return;

    const { y, x } = cpuLevel1(game);
    setGame(game.put(y, x));
  }, [game, setGame, isMyTurn]);
  const onPut = (y: number, x: number) => setGame(game.put(y, x));
  return (
    <div className="w-full h-screen">
      <GameArea game={game} onPut={onPut} canMutate={isMyTurn} />
    </div>
  );
}
