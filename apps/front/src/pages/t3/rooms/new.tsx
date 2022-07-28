import { useRouter } from "next/router";
import { useEffect } from "react";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "t3";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:4000"
);

export default function TicTacToeRoomsNew() {
  const router = useRouter();
  useEffect(() => {
    const roomCreated = (id: string) => {
      console.log(id);
      router.push(`/t3/rooms/${id}`);
    };
    socket.on("roomCreated", roomCreated);
    return () => {
      socket.off("roomCreated", roomCreated);
    };
  }, [router]);

  const onClick = () => {
    socket.emit("createRoom");
  };
  return (
    <div>
      <button onClick={onClick}>ルームを作成</button>
    </div>
  );
}
