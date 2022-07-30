import clsx from "clsx";
import type { Game } from "t3";

import { SystemButton } from "./SystemButton";

const Nought = () => {
  return (
    <svg viewBox="0 0 48 48">
      <circle
        cx={24}
        cy={24}
        r={16}
        stroke="#000"
        strokeWidth={2}
        fill="none"
      />
    </svg>
  );
};

const Cross = () => {
  return (
    <svg viewBox="0 0 48 48">
      <line
        x1={10}
        y1={10}
        x2={38}
        y2={38}
        stroke="#000"
        strokeWidth={2}
        fill="none"
      />
      <line
        x1={38}
        y1={10}
        x2={10}
        y2={38}
        stroke="#000"
        strokeWidth={2}
        fill="none"
      />
    </svg>
  );
};

type GameAreaProps = {
  game: Game;
  canMutate: boolean;
  onPut: (y: number, x: number) => void;
  playerName?: (playerId: string) => string;
  canRestart: boolean;
  onRestart: () => void;
};
export const GameArea = (props: GameAreaProps) => {
  const getPlayerName =
    props.playerName ||
    ((playerId: string): string => {
      if (playerId === props.game.players[0].id) return "◯";
      if (playerId === props.game.players[1].id) return "×";
      return "?";
    });
  return (
    <div className="flex justify-center items-center">
      <div className="max-h-64 flex flex-col items-center gap-y-8">
        <div className="w-48 h-48 border border-gray-700">
          {props.game.cells.map((lineCells, y) => (
            <div key={y} className="flex">
              {lineCells.map((cell, x) => (
                <div
                  key={x}
                  className={clsx(
                    "w-16 h-16 border border-gray-700",
                    props.canMutate &&
                      !props.game.gameResult &&
                      props.game.canPut(y, x) &&
                      "hover:bg-gray-700/20 cursor-pointer"
                  )}
                  onClick={() => props.canMutate && props.onPut(y, x)}
                >
                  {cell === props.game.players[0].id ? (
                    <Nought />
                  ) : cell === props.game.players[1].id ? (
                    <Cross />
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        {!props.game.gameResult && (
          <p className="text-3xl">
            {getPlayerName(props.game.turnPlayerId) + "の手番"}
          </p>
        )}
        {props.game.gameResult && props.game.gameResult.type === "win" && (
          <p className="text-3xl">
            {getPlayerName(props.game.gameResult.winnerId) + "の勝ち"}
          </p>
        )}
        {props.game.gameResult && props.game.gameResult.type === "draw" && (
          <p className="text-3xl">引き分け</p>
        )}
        {props.game.gameResult && props.canRestart && (
          <div>
            <SystemButton onClick={props.onRestart}>
              もういちどプレイする
            </SystemButton>
          </div>
        )}
      </div>
    </div>
  );
};
