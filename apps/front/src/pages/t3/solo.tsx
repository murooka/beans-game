import { useEffect, useState } from "react";
import { Game } from "t3";

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
  const isMyTurn = game.turnPlayerIndex === 0;
  useEffect(() => {
    if (game.gameResult) return;
    if (isMyTurn) return;

    const { y, x } = cpuLevel1(game);
    setGame(game.put(y, x));
  }, [game, setGame, isMyTurn]);
  const onPut = (y: number, x: number) => setGame(game.put(y, x));
  const getPlayerName = (playerId: string): string => {
    return playerId === game.players[0].id ? "あなた" : "あいて";
  };
  const onRestart = () => {
    setGame(new Game());
  };
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <GameArea
        game={game}
        onPut={onPut}
        canMutate={isMyTurn}
        playerName={getPlayerName}
        canRestart
        onRestart={onRestart}
      />
    </div>
  );
}
