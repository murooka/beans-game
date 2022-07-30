import type { GetServerSideProps } from "next";
import Link from "next/link";
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
import { SystemButton } from "../../../components/SystemButton";
import { API_ORIGIN, WEB_ORIGIN } from "../../../config";
import { firstOrNull } from "../../../lib/data";
import { getOrCreateAnonymousPlayerId } from "../../../lib/storage";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
  io(API_ORIGIN);

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
  const [full, setFull] = useState(false);

  useEffect(() => {
    const gameStarted = (roomId: string, game: GameObject) => {
      console.log(`gameStarted`);
      setGame(Game.fromObject(game));
    };
    const roomFull = () => {
      setFull(true);
    };
    const gameChanged = (roomId: string, object: GameObject) => {
      setGame(Game.fromObject(object));
    };
    const gameRestarted = (roomId: string, object: GameObject) => {
      setGame(Game.fromObject(object));
    };

    socket.emit("t3/join-room", roomId, playerId);
    socket.on("t3/game-started", gameStarted);
    socket.on("t3/room-full", roomFull);
    socket.on("t3/game-changed", gameChanged);
    socket.on("t3/game-restarted", gameRestarted);

    return () => {
      socket.off("t3/game-started", gameStarted);
      socket.off("t3/room-full", roomFull);
      socket.off("t3/game-changed", gameChanged);
      socket.off("t3/game-restarted", gameRestarted);
    };
  }, [roomId, playerId]);

  const put = (y: number, x: number) => {
    socket.emit("t3/put", roomId, y, x);
  };

  const restart = () => {
    socket.emit("t3/restart-game", roomId);
  };

  return { game, full, put, restart };
};

export default function TicTacToeRoomsId(props: Props) {
  const playerId = getOrCreateAnonymousPlayerId();
  const { game, full, put, restart } = useGame(props.roomId, playerId);

  const getPlayerName = (_: string): string =>
    _ === playerId ? "あなた" : "あいて";

  const roomUrl = `${WEB_ORIGIN}/t3/rooms/${props.roomId}`;

  return full ? (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div>満員です</div>
      <div className="mt-4">
        <Link href="/t3">
          <a>
            <SystemButton>ゲームメニューに戻る</SystemButton>
          </a>
        </Link>
      </div>
    </div>
  ) : game ? (
    <div className="w-full h-screen flex justify-center items-center">
      <GameArea
        game={game}
        canMutate={playerId === game.turnPlayerId}
        onPut={put}
        playerName={getPlayerName}
        canRestart={game.players[0].id === playerId}
        onRestart={restart}
      />
    </div>
  ) : (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div>参加者待ち</div>
      <div className="mt-2 flex">
        <input
          type="text"
          readOnly
          value={roomUrl}
          className="border rounded px-2 py-1"
        />
      </div>
    </div>
  );
}
