import type { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { Game } from "tic-tac-toe";
import type {
  ClientToServerEvents,
  GameObject,
  ServerToClientEvents,
} from "tic-tac-toe";

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

type ViewPlayingProps = {
  roomId: string;
  playerId: string;
  initialGame: Game;
};
const ViewPlaying = (props: ViewPlayingProps) => {
  const [game, setGame] = useState(props.initialGame);
  useEffect(() => {
    const gameChanged = (roomId: string, object: GameObject) => {
      setGame(Game.fromObject(object));
    };
    socket.on("gameChanged", gameChanged);
    return () => {
      socket.off("gameChanged", gameChanged);
    };
  });
  const onPut = (y: number, x: number) => {
    socket.emit("put", props.roomId, y, x);
  };
  return (
    <div>
      <GameArea
        game={game}
        canMutate={props.playerId === game.turnPlayerId}
        onPut={onPut}
      />
    </div>
  );
};

type ViewWaitingProps = { roomId: string };
const ViewWaiting = (props: ViewWaitingProps) => {
  return (
    <div>
      <div>waiting</div>
      <div>Room ID : {props.roomId}</div>
    </div>
  );
};

export default function TicTacToeRoomsId(props: Props) {
  const playerId = getOrCreateAnonymousPlayerId();
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    const gameStarted = (roomId: string, game: GameObject) => {
      console.log(`gameStarted`);
      setGame(Game.fromObject(game));
    };

    socket.on("gameStarted", gameStarted);
    return () => {
      socket.off("gameStarted", gameStarted);
    };
  }, []);

  const roomId = props.roomId;
  useEffect(() => {
    socket.emit("joinRoom", roomId, playerId);
  }, [roomId, playerId]);

  return game ? (
    <ViewPlaying roomId={roomId} playerId={playerId} initialGame={game} />
  ) : (
    <ViewWaiting roomId={roomId} />
  );
}
