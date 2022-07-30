import { useState } from "react";
import { Game } from "t3";

import { GameArea } from "../../components/GameArea";

export default function TicTacToeLocal() {
  const [game, setGame] = useState(new Game());
  const onPut = (y: number, x: number) => setGame(game.put(y, x));
  const onRestart = () => {
    setGame(new Game());
  };
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <GameArea
        game={game}
        onPut={onPut}
        canMutate
        canRestart
        onRestart={onRestart}
      />
    </div>
  );
}
