import clsx from "clsx";
import type { Game } from "tic-tac-toe";

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
  onPut: (y: number, x: number) => void;
};
export const GameArea = (props: GameAreaProps) => {
  console.log(JSON.stringify(props.game.cells, null, 2));
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-y-12">
      <div className="w-48 h-48 border border-gray-700">
        {props.game.cells.map((lineCells, y) => (
          <div key={y} className="flex">
            {lineCells.map((cell, x) => (
              <div
                key={x}
                className={clsx(
                  "w-16 h-16 border border-gray-700",
                  !props.game.gameResult &&
                    props.game.canPut(y, x) &&
                    "hover:bg-gray-700/20 cursor-pointer"
                )}
                onClick={() => props.onPut(y, x)}
              >
                {cell === 1 ? <Nought /> : cell === 2 ? <Cross /> : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
      {!props.game.gameResult && (
        <p className="text-3xl">
          {props.game.turnPlayerId === 1
            ? "◯"
            : props.game.turnPlayerId === 2
            ? "×"
            : "?"}
          の手番
        </p>
      )}
      {props.game.gameResult && props.game.gameResult.type === "win" && (
        <p className="text-3xl">
          {props.game.gameResult.winnerId === 1
            ? "◯"
            : props.game.gameResult.winnerId === 2
            ? "×"
            : "?"}
          の勝利
        </p>
      )}
      {props.game.gameResult && props.game.gameResult.type === "draw" && (
        <p className="text-3xl">引き分け</p>
      )}
    </div>
  );
};
