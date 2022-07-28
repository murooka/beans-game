import type { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { Game } from "t3";
import type {
  ClientToServerEvents,
  GameObject,
  ServerToClientEvents,
} from "t3";

import { GameArea } from "../../../components/GameArea";
import { firstOrNull } from "../../../lib/data";
import { getOrCreateAnonymousPlayerId } from "../../../lib/storage";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:4000"
);

type Props = {
  roomId: string;
};
export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const roomId = firstOrNull(ctx.query.roomId);
  if (roomId == null) return { notFound: true };

  return { props: { roomId } };
};

const useGame = (roomId: string, playerId: string) => {
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    const gameStarted = (roomId: string, game: GameObject) => {
      console.log(`gameStarted`);
      setGame(Game.fromObject(game));
    };
    const gameChanged = (roomId: string, object: GameObject) => {
      setGame(Game.fromObject(object));
    };

    socket.emit("t3/join-room", roomId, playerId);
    socket.on("t3/game-started", gameStarted);
    socket.on("t3/game-changed", gameChanged);

    return () => {
      socket.off("t3/game-started", gameStarted);
      socket.off("t3/game-changed", gameChanged);
    };
  }, [roomId, playerId]);

  const put = (y: number, x: number) => {
    socket.emit("t3/put", roomId, y, x);
  };

  return { game, put };
};

export default function TicTacToeRoomsId(props: Props) {
  const playerId = getOrCreateAnonymousPlayerId();
  const { game, put } = useGame(props.roomId, playerId);

  const getPlayerName = (_: string): string =>
    _ === playerId ? "あなた" : "あいて";

  return game ? (
    <div>
      <GameArea
        game={game}
        canMutate={playerId === game.turnPlayerId}
        onPut={put}
        playerName={getPlayerName}
      />
    </div>
  ) : (
    <div>
      <div>waiting</div>
      <div>Room ID : {props.roomId}</div>
    </div>
  );
}
