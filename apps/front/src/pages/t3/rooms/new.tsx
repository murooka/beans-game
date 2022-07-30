import { useRouter } from "next/router";
import { useEffect } from "react";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "t3";

import { SystemButton } from "../../../components/SystemButton";
import { API_ORIGIN } from "../../../config";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
  io(API_ORIGIN);

export default function TicTacToeRoomsNew() {
  const router = useRouter();
  useEffect(() => {
    const roomCreated = (id: string) => {
      console.log(id);
      router.push(`/t3/rooms/${id}`);
    };
    socket.on("t3/room-created", roomCreated);
    return () => {
      socket.off("t3/room-created", roomCreated);
    };
  }, [router]);

  const onClick = () => {
    socket.emit("t3/create-room");
  };
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <SystemButton onClick={onClick}>ルームを作成</SystemButton>
    </div>
  );
}
